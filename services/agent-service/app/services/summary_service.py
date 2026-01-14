from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from langchain_google_genai import ChatGoogleGenerativeAI

from app.models import DailySummary, Article, ViewDailySummary
from app.schemas import (
    DailySummaryResponse,
    ArticleResponse,
    Article as ArticleSchema,
    PeriodicSummaryResponse,
)
from app.agents.summary_agent import SummaryAgent
from app.agents.agent_config import AgentSettings


def create_summary_agent() -> SummaryAgent:
    settings = AgentSettings()
    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    return SummaryAgent(model, settings)


def fetch_articles(db: Session, summary_date: date) -> list[Article]:
    start_date = datetime.combine(summary_date, datetime.min.time())
    end_date = start_date + timedelta(days=1)

    articles = (
        db.query(Article)
        .filter(Article.published_at >= start_date)
        .filter(Article.published_at < end_date)
        .all()
    )

    if not articles:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No articles found for the specified date",
        )

    return articles


def convert_articles_to_schema(articles: list[Article]) -> list[ArticleSchema]:
    articles_valid = [ArticleResponse.model_validate(a) for a in articles]
    return [
        ArticleSchema(
            id=a.id,
            url=a.url,
            published_at=a.published_at,
            title=a.title,
            description=a.description,
            source=a.source,
            categories=a.categories,
        )
        for a in articles_valid
    ]

def delete_unassigned_articles(
    db: Session, summary_date: date, referenced_ids: set[int]
) -> None:
    start_date = datetime.combine(summary_date, datetime.min.time())
    end_date = start_date + timedelta(days=1)
    db.query(Article).filter(
        Article.published_at >= start_date,
        Article.published_at < end_date,
        ~Article.id.in_(referenced_ids),
    ).delete(synchronize_session=False)

def update_article_references(
    db: Session, db_summary: DailySummary, references_data: dict, summary_date: date
) -> None:
    if not references_data:
        return

    all_referenced_ids: set[int] = set()

    for categories_dict in references_data.values():
        for category_name, article_ids in categories_dict.items():
            if article_ids:
                all_referenced_ids.update(article_ids)
                db.query(Article).filter(Article.id.in_(article_ids)).update(
                    {
                        Article.daily_summary_id: db_summary.id,
                        Article.category: category_name,
                    },
                    synchronize_session=False,
                )

    delete_unassigned_articles(db, summary_date, all_referenced_ids)


def replace_article_ids_with_urls(
    db: Session, references: dict[str, list[int]]
) -> dict[str, list[str]]:
    all_ids = []
    for source_refs in references.values():
        all_ids.extend(source_refs)

    articles = db.query(Article).filter(Article.id.in_(all_ids)).all()
    id_to_url = {article.id: article.url for article in articles}

    return {
        source_name: [id_to_url[article_id] for article_id in ref_list]
        for source_name, ref_list in references.items()
    }


def get_daily_summary(summary_date: date, db: Session) -> DailySummaryResponse:
    existing_summary = (
        db.query(DailySummary).filter(DailySummary.date == summary_date).first()
    )

    if existing_summary:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Daily summary for {summary_date} already exists",
        )

    articles = fetch_articles(db, summary_date)
    articles_conv = convert_articles_to_schema(articles)

    agent = create_summary_agent()
    daily_summary = agent.get_daily_summary(
        articles=articles_conv, summary_date=summary_date
    )

    references_data = daily_summary.references

    db_summary = DailySummary(**daily_summary.model_dump(exclude={"references"}))
    db.add(db_summary)
    db.flush()

    update_article_references(db, db_summary, references_data, summary_date)

    db.commit()
    db.refresh(db_summary)

    db_summary.references = references_data

    return db_summary


def get_periodic_summary(
    start: date,
    end: date,
    sources: list[str],
    categories: list[str],
    db: Session,
) -> PeriodicSummaryResponse:
    if start > end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be after end date",
        )

    summaries = (
        db.query(ViewDailySummary)
        .filter(ViewDailySummary.date >= start, ViewDailySummary.date <= end)
        .order_by(ViewDailySummary.date.desc())
        .all()
    )

    if not summaries:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No daily summaries found for the specified date range",
        )

    for s in summaries:
        s.id = s.summary_id

    summaries_valid = [DailySummaryResponse.model_validate(s) for s in summaries]

    agent = create_summary_agent()
    periodic_summary = agent.get_periodic_summary(
        daily_summaries=summaries_valid,
        sources=sources,
        categories=categories,
        start_date=start,
        end_date=end,
    )

    if periodic_summary.references:
        periodic_summary.references = replace_article_ids_with_urls(
            db, periodic_summary.references
        )

    return periodic_summary

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from app.database.database import get_db
from app.models import DailySummary, Article as ArticleModel
from app.schemas import DailySummaryResponse, ArticleResponse, Article
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.summary_agent import SummaryAgent
from app.agents.agent_config import AgentSettings

router = APIRouter(prefix="/daily_summary")


@router.post(
    "/", response_model=DailySummaryResponse, status_code=status.HTTP_201_CREATED
)
def get_daily_summary(
    summary_date: date = Query(...),
    db: Session = Depends(get_db),
):
    existing_summary = (
        db.query(DailySummary).filter(DailySummary.date == summary_date).first()
    )

    if existing_summary:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Daily summary for {summary_date} already exists",
        )

    start_date = datetime.combine(summary_date, datetime.min.time())
    end_date = start_date + timedelta(days=1)

    articles = (
        db.query(ArticleModel)
        .filter(ArticleModel.published_at >= start_date)
        .filter(ArticleModel.published_at < end_date)
        .all()
    )

    if not articles:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No articles found for the specified date",
        )

    articles_valid = [ArticleResponse.model_validate(a) for a in articles]
    articles_conv = [
        Article(
            id=a.id,
            url=a.url,
            published_at=a.published_at,
            title=a.title,
            description=a.description,
            source=a.source,
        )
        for a in articles_valid
    ]

    settings = AgentSettings()
    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    agent = SummaryAgent(model, settings)
    daily_summary = agent.get_daily_summary(
        articles=articles_conv, summary_date=summary_date
    )

    references_data = daily_summary.references

    db_summary = DailySummary(**daily_summary.model_dump(exclude={"references"}))
    db.add(db_summary)
    db.flush()

    if references_data:
        for source_name, categories_dict in references_data.items():
            for category_name, article_ids in categories_dict.items():
                if article_ids:
                    db.query(ArticleModel).filter(
                        ArticleModel.id.in_(article_ids)
                    ).update(
                        {
                            ArticleModel.daily_summary_id: db_summary.id,
                            ArticleModel.category: category_name,
                        },
                        synchronize_session=False,
                    )
    db.commit()
    db.refresh(db_summary)

    db_summary.references = references_data

    return db_summary

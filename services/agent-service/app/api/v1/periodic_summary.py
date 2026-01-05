from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import date
from app.database.database import get_db
from app.models import ViewDailySummary, Article
from app.schemas import PeriodicSummaryResponse, DailySummaryResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.summary_agent import SummaryAgent
from app.agents.agent_config import AgentSettings

router = APIRouter(prefix="/periodic_summary")


@router.get("/", response_model=PeriodicSummaryResponse)
def get_periodic_summary(
    start: date = Query(...),
    end: date = Query(...),
    sources: list[str] = Query(...),
    categories: list[str] = Query(...),
    db: Session = Depends(get_db),
):
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

    settings = AgentSettings()
    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    agent = SummaryAgent(model, settings)
    periodic_summary = agent.get_periodic_summary(
        daily_summaries=summaries_valid,
        sources=sources,
        categories=categories,
        start_date=start,
        end_date=end,
    )

    if periodic_summary.references:
        all_ids = []
        for source_refs in periodic_summary.references.values():
            all_ids.extend(source_refs)

        articles = db.query(Article).filter(Article.id.in_(all_ids)).all()
        id_to_url = {article.id: article.url for article in articles}

        for source_name, ref_list in periodic_summary.references.items():
            periodic_summary.references[source_name] = [
                id_to_url.get(article_id, article_id) for article_id in ref_list
            ]

    return periodic_summary

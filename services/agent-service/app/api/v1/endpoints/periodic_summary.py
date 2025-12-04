from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import date
from app.database.database import get_db
from app.models import ViewDailySummary
from app.schemas import PeriodicSummary, DailySummaryResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.summary_agent import SummaryAgent
from app.agents.agent_config import AgentSettings

router = APIRouter(prefix="/periodic_summary")


@router.get("/", response_model=PeriodicSummary)
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

    return periodic_summary

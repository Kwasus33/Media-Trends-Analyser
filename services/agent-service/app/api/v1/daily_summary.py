from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from datetime import date

from app.database.database import get_db
from app.schemas import DailySummaryResponse
from app.services import summary_service

router = APIRouter(prefix="/daily_summary")


@router.post(
    "/", response_model=DailySummaryResponse, status_code=status.HTTP_201_CREATED
)
def get_daily_summary(
    summary_date: date = Query(...),
    db: Session = Depends(get_db),
):
    return summary_service.get_daily_summary(summary_date, db)

@router.get(
    "/recent",
    response_model=list[DailySummaryResponse],
    status_code=status.HTTP_200_OK,
)
def get_recent_daily_summaries(
    db: Session = Depends(get_db),
):
    return summary_service.get_recent_daily_summaries(db)
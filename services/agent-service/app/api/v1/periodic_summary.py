from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date

from app.database.database import get_db
from app.schemas import PeriodicSummaryResponse
from app.services import summary_service

router = APIRouter(prefix="/periodic_summary")


@router.get("/", response_model=PeriodicSummaryResponse)
def get_periodic_summary(
    start: date = Query(...),
    end: date = Query(...),
    sources: list[str] = Query(...),
    categories: list[str] = Query(...),
    db: Session = Depends(get_db),
):
    return summary_service.get_periodic_summary(start, end, sources, categories, db)

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models import DailySummary, Article, ViewDailySummary
from app.schemas import DailySummaryCreate, DailySummaryResponse
from datetime import date


router = APIRouter(prefix="/daily_summaries")


@router.post(
    "/", response_model=DailySummaryResponse, status_code=status.HTTP_201_CREATED
)
def create_daily_summary(
    summary_data: DailySummaryCreate, db: Session = Depends(get_db)
):
    existing_summary = (
        db.query(DailySummary).filter(DailySummary.date == summary_data.date).first()
    )

    if existing_summary:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Daily summary for {summary_data.date} already exists",
        )

    references_data = summary_data.references

    db_summary = DailySummary(**summary_data.model_dump(exclude={"references"}))
    db.add(db_summary)
    db.flush()

    if references_data:
        for source_name, categories_dict in references_data.items():
            for category_name, article_ids in categories_dict.items():
                if article_ids:
                    db.query(Article).filter(Article.id.in_(article_ids)).update(
                        {
                            Article.daily_summary_id: db_summary.id,
                            Article.category: category_name,
                        },
                        synchronize_session=False,
                    )
    db.commit()
    db.refresh(db_summary)

    db_summary.references = references_data

    return db_summary


@router.get("/date/{summary_date}", response_model=DailySummaryResponse)
def get_daily_summary_by_date(summary_date: date, db: Session = Depends(get_db)):
    summary = (
        db.query(ViewDailySummary).filter(ViewDailySummary.date == summary_date).first()
    )

    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")

    summary.id = summary.summary_id

    return summary


@router.get("/range", response_model=list[DailySummaryResponse])
def get_summaries_by_range(
    start: date = Query(...),
    end: date = Query(...),
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

    for s in summaries:
        s.id = s.summary_id

    return summaries

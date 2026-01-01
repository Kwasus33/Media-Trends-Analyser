from sqlalchemy import Integer, Date
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from datetime import date
from .base import Base


class ViewDailySummary(Base):
    __tablename__ = "view_daily_summary"

    summary_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[date] = mapped_column(Date, unique=True, nullable=False)
    summaries: Mapped[dict] = mapped_column(JSONB)
    categories: Mapped[dict] = mapped_column(JSONB)
    references: Mapped[dict] = mapped_column(JSONB)

    def __repr__(self) -> str:
        return f"ViewDailySummary(id={self.summary_id}, date={self.date})"

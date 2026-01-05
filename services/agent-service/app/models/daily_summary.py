from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, Integer
from sqlalchemy.dialects.postgresql import JSONB
from datetime import date
from .base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .article import Article


class DailySummary(Base):
    __tablename__ = "daily_summary"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[date] = mapped_column(Date, unique=True, nullable=False)
    summaries: Mapped[dict] = mapped_column(JSONB)
    categories: Mapped[dict] = mapped_column(JSONB)

    articles: Mapped[list["Article"]] = relationship(back_populates="daily_summary")

    def __repr__(self) -> str:
        return f"DailySummary(id={self.id}, date={self.date})"

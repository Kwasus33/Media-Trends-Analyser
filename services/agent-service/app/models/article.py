from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from .base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .daily_summary import DailySummary


class Article(Base):
    __tablename__ = "article"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    title: Mapped[str | None] = mapped_column(Text, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str | None] = mapped_column(Text, nullable=True)
    categories: Mapped[dict | None] = mapped_column(JSONB, nullable=True)  # DODANE
    category: Mapped[str | None] = mapped_column(Text, nullable=True)

    daily_summary_id: Mapped[int | None] = mapped_column(ForeignKey("daily_summary.id"))
    daily_summary: Mapped["DailySummary"] = relationship(back_populates="articles")

    def __repr__(self) -> str:
        return f"Article(id={self.id}, title={self.title})"

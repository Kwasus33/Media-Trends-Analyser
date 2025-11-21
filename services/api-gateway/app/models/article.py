from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, DateTime, Date, ForeignKey
from datetime import datetime
from base import Base
from daily_summary import DailySummary


class Article(Base):
    __tablename__ = "article"

    id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    published_at: Mapped[datetime] = mapped_column(DateTime)
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    source: Mapped[str] = mapped_column(Text)
    daily_summary_id: Mapped[int] = mapped_column(
        ForeignKey("daily_summary.id", ondelete="SET NULL"),
        nullable=True
    )

    daily_summary: Mapped["DailySummary"] = relationship(
        back_populates="articles"
    )

    def __repr__(self) -> str:
        return f"Article(id={self.id}, title={self.title})"

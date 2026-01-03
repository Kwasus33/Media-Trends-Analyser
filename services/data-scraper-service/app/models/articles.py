from sqlalchemy import Integer, String, Text, DateTime, ARRAY, Identity
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from datetime import datetime


class Base(DeclarativeBase): ...


class ArticleDB(Base):
    __tablename__ == "articles"

    id: Mapped[int] = mapped_column(Integer, Identity(), primary_key=True)
    title: Mapped[str | None] = mapped_column(String, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False)
    published_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    source: Mapped[str | None] = mapped_column(String, nullable=True)
    category: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False)

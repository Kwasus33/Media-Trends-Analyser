from datetime import date
from pydantic import BaseModel, HttpUrl, Field


class DailySummary(BaseModel):
    date: date
    summary: str
    categories: dict[str, int] = Field(default_factory=dict)
    references: list[HttpUrl] = Field(default_factory=list)

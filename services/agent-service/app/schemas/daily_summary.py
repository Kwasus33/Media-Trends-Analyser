from datetime import date
from pydantic import BaseModel, Field


class DailySummary(BaseModel):
    id: int
    date: date
    summaries: dict[str, str] = Field(default_factory=dict)
    categories: dict[str, dict[str, int]] = Field(default_factory=dict)
    references: dict[str, list[int]] = Field(default_factory=list)

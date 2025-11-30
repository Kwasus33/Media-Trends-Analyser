from datetime import date
from pydantic import BaseModel, Field


class PeriodicSummary(BaseModel):
    start_date: date
    end_date: date

    main_summary: str

    categories_timeline: dict[str, list[int]] = Field(default_factory=dict)
    category_totals: dict[str, int] = Field(default_factory=dict)

    trends: dict[str, list[str]] = Field(default_factory=list)

    key_insights: list[str] = Field(default_factory=list)
    source_highlights: dict[str, str] = Field(default_factory=dict)
    event_timeline: dict[date, str] = Field(default_factory=dict)

    references: dict[str, list[int]] = Field(default_factory=dict)

from datetime import date
from pydantic import BaseModel, Field, ConfigDict


class DailySummary(BaseModel):
    date: date

    # Key 1: Source name
    # Key 2: Category name
    # Value: Summary from a specific category and source
    summaries: dict[str, dict[str, str]] = Field(default_factory=dict)

    # Key 1: Source name
    # Key 2: Category name
    # Value: Category counter
    categories: dict[str, dict[str, int]] = Field(default_factory=dict)

    # Key 1: Source name
    # Key 2: Category name
    # Value: List of IDs
    references: dict[str, dict[str, list]] = Field(default_factory=dict)


class DailySummaryCreate(BaseModel):
    date: date
    summaries: dict[str, dict[str, str]]
    categories: dict[str, dict[str, int]]
    references: dict[str, dict[str, list]]


class DailySummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date: date
    summaries: dict[str, dict[str, str]]
    categories: dict[str, dict[str, int]]
    references: dict[str, dict[str, list]]

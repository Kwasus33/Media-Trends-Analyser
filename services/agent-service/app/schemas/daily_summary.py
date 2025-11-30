from datetime import date
from pydantic import BaseModel, Field
import random


class DailySummary(BaseModel):
    id: int
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
    # Value: List of URLs
    references: dict[str, dict[str, list[str]]] = Field(default_factory=dict)

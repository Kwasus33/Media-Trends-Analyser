from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime


class ArticleCreate(BaseModel):
    title: str | None = Field(default=None, min_length=5)
    description: str = Field(min_length=50)
    url: HttpUrl
    published_at: datetime = Field(default_factory=datetime.now)
    source: str | None = None
    category: list[str] = Field(default_factory=list, min_length=1)

    model_config = {"str_strip_whitespace": True, "extra": "forbid"}

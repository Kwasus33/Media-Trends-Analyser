from datetime import datetime
from pydantic import BaseModel, HttpUrl, ConfigDict, Field


class Article(BaseModel):
    id: int
    url: HttpUrl
    published_at: datetime
    title: str | None
    description: str
    source: str | None
    categories: list[str] = Field(default_factory=list)

    @property
    def full_description(self):
        return f"id: {self.id}, title: {self.title}, description: {self.description}, source: {self.source}, categories: {self.categories}"


class ArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    published_at: datetime
    title: str | None
    description: str
    source: str | None
    categories: list[str] = Field(default_factory=list)

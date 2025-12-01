from datetime import datetime
from pydantic import BaseModel, HttpUrl, ConfigDict


class Article(BaseModel):
    id: int
    url: HttpUrl
    published_at: datetime
    title: str
    description: str
    source: str

    @property
    def full_description(self):
        return f"title: {self.title}, description: {self.description}, url: {self.url}, source: {self.source}"


class ArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    published_at: datetime | None
    title: str | None
    description: str | None
    source: str | None

from datetime import datetime
from pydantic import BaseModel, HttpUrl


class Article(BaseModel):
    url: HttpUrl
    title: str
    description: str
    published_at: datetime

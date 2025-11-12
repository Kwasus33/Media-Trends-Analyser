from datetime import datetime
from pydantic import BaseModel, HttpUrl


class Article(BaseModel):
    url: HttpUrl
    title: str
    description: str
    published_at: datetime

    def for_daily_summary(self):
        return f"title: {self.title}, description: {self.description}, url: {self.url}"

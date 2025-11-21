from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    published_at: datetime
    title: str
    description: str
    source: str
    daily_summary_id: int | None
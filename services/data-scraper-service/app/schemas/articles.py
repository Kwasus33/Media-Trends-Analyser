from pydantic import BaseModel, Field, HttpUrl, ValidationError
from datetime import datetime


class ArticleCreate(BaseModel):
    title: str = Field(min_length=5)
    description: str = Field(min_length=10)
    url: HttpUrl
    published_at: datetime = Field(default_factory=datetime.now)
    source: str
    categories: list[str] = Field(default_factory=list)

    model_config = {"str_strip_whitespace": True, "extra": "forbid"}

    @classmethod
    def create(cls, **data):
        """
        Returns instance if valid, None if invalid
        """
        try:
            return cls(**data)
        except ValidationError:
            return None

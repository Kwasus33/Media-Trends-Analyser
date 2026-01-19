from app.schemas.articles import ArticleCreate

from abc import ABC, abstractmethod
from datetime import datetime


API_SCRAPERS = {}


def save_scrapers(cls):
    API_SCRAPERS[cls.__qualname__] = cls
    return cls


class BaseScraper(ABC):
    def __init__(self, url: str, source_name: str = "Unknown") -> None:
        self.url = url
        self.source_name = source_name
        self.collected_by_url = set()

    @abstractmethod
    def collect_data(self) -> list[ArticleCreate]: ...

    def _save_article(
        self,
        title: str,
        description: str,
        url: str,
        categories: list[str],
        date: datetime | None = None,
        source: str | None = None,
    ):
        """..."""
        article = ArticleCreate.create(
            title=title,
            description=description,
            url=url,
            published_at=date if date else datetime.now(),
            source=source if source else self.source_name,
            categories=categories,
        )

        if article:
            self.collected_by_url.add(url)
        return article

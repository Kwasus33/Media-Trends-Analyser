from app.scrapers import API_SCRAPERS
from app.core.config import CONTEXT

from dotenv import load_dotenv
import random
import os

load_dotenv()


class ScraperService(object):
    """
    Singleton class ScraperService for fetching articles
    """

    def __new__(cls):
        if not hasattr(cls, "instance"):
            cls.instance = super(ScraperService, cls).__new__(cls)
        return cls.instance

    def fetch_articles(self, source: str, category: str | None = None):
        """
        Fetch_articles gets all articles from given source of 'category' (if specified else all available)

        :param source: name of accessed source e.g. RSS, API
        :type source: str
        :param category: catrgory of source entries to get, None if source categories are not defined
        :type category: str | None
        """
        if source not in CONTEXT:
            raise ValueError(f"Source: `{source}` not found")

        scraper_type, base_url, available_categories, source_name, api_key_name = (
            self._validate_configuration(source, category)
        )

        if not category and available_categories:
            category = random.choice(available_categories)

        scraper = API_SCRAPERS[scraper_type]
        api_key = os.getenv(api_key_name)
        source_name = source_name if source_name else "Unknown"
        scraper = (
            scraper(base_url, source_name, api_key)
            if api_key
            else scraper(base_url, source_name)
        )

        return scraper.collect_data(category)

    def fetch_all_articles(self, limit_per_source: int | None = None):
        """
        Fetch_articles gets all articles from all sources and categories (if specified)
        defined in `core/config.json` file

        :param limit_per_source: Description
        :type limit_per_source: int
        :returns: ...
        :rtype: list[ArticleCreate]
        """
        data = []

        for source in CONTEXT:
            (
                scraper_type,
                base_url,
                available_categories,
                source_name,
                api_key_name,
            ) = self._validate_configuration(source)

            scraper = API_SCRAPERS[scraper_type]
            api_key = os.getenv(api_key_name)
            source_name = source_name if source_name else "Unknown"
            scraper = (
                scraper(base_url, source_name, api_key)
                if api_key
                else scraper(base_url, source_name)
            )

            if available_categories:
                for category in available_categories:
                    data += (
                        scraper.collect_data(category)[:limit_per_source]
                        if limit_per_source
                        else scraper.collect_data(category)
                    )
            else:
                data += (
                    scraper.collect_data()[:limit_per_source]
                    if limit_per_source
                    else scraper.collect_data()
                )

        return data

    def _validate_configuration(self, source: str, category: str | None = None):
        """
        Docstring for _validate_configuration

        :param self: Description
        :param source_data: Description
        """
        source_data = CONTEXT[source]

        scraper_type = source_data["type"]
        if scraper_type not in API_SCRAPERS:
            raise RuntimeError(f"Scraper `{scraper_type}` is not configured")

        base_url = source_data["endpoint"].get("base_url", None)
        if not base_url:
            raise ValueError("Chosen source scraper missing URL in configuration")

        available_categories = source_data["endpoint"].get("categories", [])

        if category and category not in available_categories:
            raise ValueError(f"Category: `{category}` not found for source: `{source}`")

        source_name = source_data.get("title", None)
        api_key_name = source_data.get("api_key", "")

        return (
            scraper_type,
            base_url,
            available_categories,
            source_name,
            api_key_name,
        )

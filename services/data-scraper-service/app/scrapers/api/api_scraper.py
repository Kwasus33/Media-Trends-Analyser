from app.scrapers.base_scraper import BaseScraper, save_scrapers
from app.schemas.articles import ArticleCreate
from app.utils.parser import parse_text

from abc import abstractmethod
from datetime import datetime
import requests


class ApiScraper(BaseScraper):
    def __init__(
        self, url: str, source_name: str = "Unknown", api_key: str = None
    ) -> None:
        """ """
        super().__init__(url, source_name)
        if api_key:
            self.api_key = api_key
            self.url += self.api_key

    def collect_data(self, category: str | None = None) -> list[ArticleCreate]:
        """ """
        temp_url = self.url % category if category else self.url

        try:
            response = requests.get(temp_url)
            response.raise_for_status()
            response = response.json()

        except requests.RequestException as e:
            raise Exception(f"Request failed for {temp_url}: {e}") from e
        except ValueError as e:
            raise Exception("Response is not valid JSON") from e

        status = response.get("status")
        if status and status not in ("OK", 200):
            raise Exception(f"API error status: {status}")

        return self._extract_data(response, category)

    @abstractmethod
    def _extract_data(self, response, category): ...

    def _is_valid_article(self, entry, title_tag, description_tag, url_tag):
        title = entry.get(title_tag, None)
        title = parse_text(title)

        description = entry.get(description_tag, None)
        description = parse_text(description)

        url = entry.get(url_tag, None)

        if not title or not description or not url or url in self.collected_by_url:
            return False
        return title, description, url


@save_scrapers
class NYTScraper(ApiScraper):
    def _extract_data(self, response, category) -> list[ArticleCreate]:
        data: list[ArticleCreate] = []
        for result in response["results"]:
            res = self._is_valid_article(
                result, title_tag="title", description_tag="abstract", url_tag="url"
            )
            if not res:
                continue

            date = result.get("published_date", None)
            try:
                date = datetime.fromisoformat(date) if date else datetime.now()
            except Exception as e:
                continue

            categories = [category] if category else []
            categories += result.get("des_facet", []) + result.get("org_facet", [])

            article = self._save_article(*res, categories, date)
            if article:
                data.append(article)
        return data


@save_scrapers
class BBCScraper(ApiScraper):
    def _extract_data(self, response, category) -> list[ArticleCreate]:
        data: list[ArticleCreate] = []
        for key, values in response.items():
            if isinstance(values, list):
                for value in values:
                    res = self._is_valid_article(
                        value,
                        title_tag="title",
                        description_tag="summary",
                        url_tag="news_link",
                    )
                    if not res:
                        continue

                    categories = ([category] if category else []) + [key]

                    article = self._save_article(*res, categories)
                    if article:
                        data.append(article)
        return data

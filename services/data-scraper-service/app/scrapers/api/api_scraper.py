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

    def collect_data(self, category: str | None = None) -> list:
        """ """
        self.category = category
        temp_url = self.url % self.category if self.category else self.url

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

        return self._extract_data(response)

    @abstractmethod
    def _extract_data(self, response): ...


@save_scrapers
class NYTScraper(ApiScraper):
    def _extract_data(self, response):
        data = []
        for result in response["results"]:
            try:
                title = result["title"]
                title = parse_text(title)

                description = result["abstract"]
                description = parse_text(description)

                url = result.get("url", None)
                categories = [self.category] if self.category else []
                categories += result.get("des_facet", []) + result.get("org_facet", [])

                if not description or not url:
                    continue

                date = result.get("published_date", None)

                article = ArticleCreate.create(
                    title=title,
                    description=description,
                    url=url,
                    published_at=datetime.fromisoformat(date)
                    if date
                    else datetime.now(),
                    source=self.source_name,
                    categories=categories,
                )

                if article:
                    data.append(article)

            # will be better specified later
            except Exception:
                pass

        return data


@save_scrapers
class BBCScraper(ApiScraper):
    def _extract_data(self, response):
        data = []
        for key, values in response.items():
            if isinstance(values, list):
                for value in values:
                    try:
                        title = value["title"]
                        title = parse_text(title)

                        description = value["summary"]
                        description = parse_text(description)

                        url = value.get("news_link", None)

                        if not title or not description or not url:
                            continue

                        article = ArticleCreate.create(
                            title=title,
                            description=description,
                            url=url,
                            source=self.source_name,
                            categories=([self.category] if self.category else [])
                            + [key],
                        )
                        if article:
                            data.append(article)

                    # will be better specified later
                    except Exception:
                        pass
        return data

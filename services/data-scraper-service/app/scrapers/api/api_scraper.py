from app.scrapers.base_scraper import BaseScraper, save_scrapers
from app.schemas.articles import ArticleCreate

from abc import abstractmethod
from datetime import datetime

import requests


class ApiScraper(BaseScraper):
    def __init__(self, url: str, api_key: str = None) -> None:
        """ """
        super().__init__(url)
        if api_key:
            self.api_key = api_key
            self.url += self.api_key

    def collect_data(self, category: str = None) -> list:
        """ """
        temp_url = self.url % category if category else self.url

        try:
            response = requests.get(temp_url)
            # response.raise_for_status()
            response = response.json()
        except requests.RequestException as e:
            raise Exception(f"Request failed for {temp_url}: {e}") from e
        except ValueError as e:
            raise Exception("Response is not valid JSON") from e

        status = response.get("status")
        if status not in ("OK", 200):
            raise Exception(f"API error status: {status}")

        return self._extract_data(response)

    @abstractmethod
    def _extract_data(self, response): ...


@save_scrapers
class NYTScrapper(ApiScraper):

    def _extract_data(self, response):
        data = []
        for result in response["results"]:
            try:
                article = ArticleCreate(
                    title=result["title"],
                    description=result["abstract"],
                    url=result["url"],
                    published_at=datetime.now(),
                    source=self.source_name,
                    category=result["des_facet"] + result["org_facet"],
                )
                data.append(article)
            except:
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
                        article = ArticleCreate(
                            title=value["title"],
                            description=value["summary"],
                            url=value["news_link"],
                            published_at=datetime.now(),
                            source=self.source_name,
                            category=[key],
                        )
                        data.append(article)
                    except:
                        pass
        return data

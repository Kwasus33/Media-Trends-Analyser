from app.scrapers.base_scraper import BaseScraper, save_scrapers
from app.schemas.articles import ArticleCreate
from datetime import datetime

import xml.etree.ElementTree as ET
import requests


@save_scrapers
class RssScraper(BaseScraper):
    def collect_data(self, category: str = None) -> list:
        """
        ...
        """
        data = []
        temp_url = self.url % category if category else self.url

        try:
            response = requests.get(temp_url)
            root = ET.fromstring(response.content)
        except requests.RequestException as e:
            raise Exception(f"Request failed for {temp_url}: {e}") from e
        # except Exception as e:
        #     raise Exception(e)

        for item in root.iter("item"):
            article = ArticleCreate(
                title=item.find(".//title").text,
                description=item.find(".//description").text,
                url=item.find(".//link").text,
                published_at=datetime.now(),
                source=self.source_name,
                category=[
                    category.text
                    for category in item.findall(".//category")
                    if category.text
                ],
            )
            data.append(article)
        return data

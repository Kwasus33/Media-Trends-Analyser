from app.scrapers.base_scraper import BaseScraper, save_scrapers
from app.schemas.articles import ArticleCreate
from app.utils.parser import parse_text

import xml.etree.ElementTree as ET
from datetime import datetime
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
            raise Exception(f"Request failed for {temp_url}: {e}")
        except Exception as e:
            raise Exception(e)

        for item in root.iter("item"):
            title = (item.find(".//title").text,)
            title = parse_text(title)

            description = (item.find(".//description").text,)
            description = parse_text(description)

            article = ArticleCreate.create(
                title=title,
                description=description,
                url=item.find(".//link").text,
                published_at=datetime.now(),
                source=self.source_name,
                categories=[
                    category.text
                    for category in item.findall(".//category")
                    if category.text
                ],
            )
            if article:
                data.append(article)

        return data

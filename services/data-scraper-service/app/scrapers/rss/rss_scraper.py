from app.scrapers.base_scraper import BaseScraper, save_scrapers
from app.schemas.articles import ArticleCreate
from app.utils.parser import parse_text

import xml.etree.ElementTree as ET
from datetime import datetime
import requests


@save_scrapers
class RssScraper(BaseScraper):
    def collect_data(self, category: str | None = None) -> list[ArticleCreate]:
        """
        ...
        """
        temp_url = self.url % category if category else self.url

        try:
            response = requests.get(temp_url)
            root = ET.fromstring(response.content)
        except requests.RequestException as e:
            raise Exception(f"Request failed for {temp_url}: {e}")
        except Exception as e:
            raise Exception(e)

        data: list[ArticleCreate] = []

        for item in root.iter("item"):
            title = item.find(".//title").text
            title = parse_text(title)

            description = item.find(".//description").text
            description = parse_text(description)
            url = item.find(".//link").text

            if not title or not description or not url or url in self.collected_by_url:
                continue

            date = item.find(".//pubDate").text
            try:
                date = date.replace("+0000", "GMT")
                published_date = (
                    datetime.strptime(date, "%a, %d %b %Y %H:%M:%S %Z")
                    if date
                    else datetime.now()
                )
            except Exception as e:
                print(f"Error parsing article publishing date - {e}")
                continue

            categories = (
                [category]
                if category
                else []
                + [
                    category.text
                    for category in item.findall(".//category")
                    if category.text
                ]
            )

            article = self._save_article(
                title, description, url, categories, published_date
            )
            if article:
                data.append(article)

        return data

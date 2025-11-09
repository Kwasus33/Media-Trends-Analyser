from base_scraper import BaseScraper

import xml.etree.ElementTree as ET
import requests


class RssScraper(BaseScraper):
    def collect_data(self, category: str = None) -> None:
        """
        ...
        """
        temp_url = self.url % category if category else self.url
        response = requests.get(temp_url)
        root = ET.fromstring(response.content)
        for item in root.iter("item"):
            temp_data = dict()
            temp_data["title"] = item.find(".//title").text
            temp_data["description"] = item.find(".//description").text
            temp_data["link"] = item.find(".//link").text
            temp_data["category"] = [
                category.text
                for category in item.findall(".//category")
                if category.text
            ]
            self.data.append(temp_data)

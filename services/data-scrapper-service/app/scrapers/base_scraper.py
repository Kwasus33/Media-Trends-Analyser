from abc import ABC, abstractmethod


class BaseScraper(ABC):
    def __init__(self, url: str) -> None:
        self.url = url
        self.data = []

    @abstractmethod
    def collect_data(self): ...

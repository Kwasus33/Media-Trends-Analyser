from abc import ABC, abstractmethod

API_SCRAPERS = {}


def save_scrapers(cls):
    API_SCRAPERS[cls.__qualname__] = cls
    return cls


class BaseScraper(ABC):
    def __init__(self, url: str, source_name: str = "Unnknown") -> None:
        self.url = url
        self.source_name = source_name

    @abstractmethod
    def collect_data(self): ...

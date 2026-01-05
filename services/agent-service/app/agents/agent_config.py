from pydantic_settings import BaseSettings


class AgentSettings(BaseSettings):
    article_categories: list[str] = [
        "Technology",
        "Politics",
        "Economy",
        "Sport",
        "Culture",
        "Society",
    ]
    sources: list[str] = ["TVN24", "Interia", "GazetaWyborcza", "Reddit", "BBC", "New York Times"]
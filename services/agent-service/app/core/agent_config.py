from pydantic_settings import BaseSettings

class AgentSettings(BaseSettings):
    gemini_api_key: str
    article_categories: list[str] = [
        "Technology",
        "Politics",
        "Economy",
        "Sport",
        "Culture"
    ]
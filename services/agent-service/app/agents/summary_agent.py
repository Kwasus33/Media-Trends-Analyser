import json
from google import genai
from google.genai.types import GenerateContentConfig
from datetime import date
from app.agents.agent_config import AgentSettings
from app.schemas.article import Article
from app.schemas.daily_summary import DailySummary
from app.schemas.period_summary import PeriodSummary


class SummaryAgent:
    def __init__(self, settings: AgentSettings):
        self.settings = settings
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = "gemini-2.0-flash"

    def generate_content(self, prompt: str, config: GenerateContentConfig) -> str:
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=config
        )
        return response.text

    def generate_daily_summary(self, articles: list[Article], summary_date: date) -> DailySummary:
        articles_text = '\n'.join([
            a.for_daily_summary() for a in articles
        ])

        prompt = self.settings.daily_summary_prompt.format(articles=articles_text)
        config = GenerateContentConfig(response_mime_type="application/json")

        json_summary = json.loads(self.generate_content(prompt, config))

        return DailySummary(
            date=summary_date,
            summary=json_summary["summary"],
            categories=json_summary["categories"],
            references=json_summary["references"]
        )

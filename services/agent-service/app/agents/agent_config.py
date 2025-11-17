import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class AgentSettings(BaseSettings):
    gemini_api_key: str = os.getenv("GEMINI_API_KEY")
    article_categories: list[str] = [
        "Technology",
        "Politics",
        "Economy",
        "Sport",
        "Culture"
    ]
    sources: list[str] = [
        "RSS",
        "Reddit",
        "BBC",
        "New York Times"
    ]

    @property
    def daily_summary_prompt(self):
        categories_str = ', '.join(self.article_categories)
        sources_str = ', '.join(self.sources)

        return f"""
            Based on the following articles, generate a summary in JSON format:
            
            {{articles}}
            
            You must include all sources from the following list, even if some sources have no articles: {sources_str}
            
            Return JSON with the following fields:
            - summaries: a dict where each key is a source name and each value is a detailed summary 
              (at least 5–7 sentences) describing the main events, topics, and trends covered by articles 
              from that specific source.
            - categories: a dict where each key is a source name and each value 
              is another dict containing category counts for that specific source 
              (keys: {categories_str})
            - references: a dict where each key is a source name and each value is a list of 
              3–5 the most important articles IDs from that specific source.
            
            Return only JSON, without additional info.
        """

    @property
    def periodic_summary_prompt(self):
        return f"""
            Based on the following daily summaries, generate a periodic summary in JSON format:

            {{daily_summaries}}

            You must aggregate information across all days in the period.

            Return JSON with the following fields:
            - main_summary: a comprehensive narrative (8–12 sentences) describing the main themes, events,
              and developments across the entire period.
            - categories_timeline: a dict where keys are category names and values are lists of integers
              representing daily counts in chronological order.
            - category_totals: total count per category across the whole period.
            - trends: a list of observed trends, including rising topics, declining topics,
              emerging themes, and notable shifts.
            - key_insights: 5–10 short bullet-style statements highlighting the most important findings.
            - source_highlights: a dict where keys are source names and values are 1–3 sentence summaries
              of what each source focused on over the period.
            - event_timeline: a dict where keys are dates (YYYY-MM-DD) and values are short descriptions
              of key events that occurred on that day, combining information from all sources.
            - references: a dict where keys are source names and values are lists of article IDs
              that were included in the summaries for that source.

            Return only JSON, with no additional explanations.
        """
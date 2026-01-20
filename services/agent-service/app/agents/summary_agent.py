from datetime import date
import json

from app.agents.agent_config import AgentSettings
from app.schemas.article import Article
from app.schemas.daily_summary import DailySummary
from app.schemas.periodic_summary import PeriodicSummary

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()


class SummaryAgent:
    def __init__(self, model: str, settings: AgentSettings):
        self.settings = settings
        self.model = model
        self.summary_categories = ", ".join(self.settings.article_categories)
        self.summary_sources = ", ".join(self.settings.sources)
        self.daily_summary_id = 0

    @property
    def daily_summary_for_source_prompt(self):
        return ChatPromptTemplate.from_template(
            """
            Based on the following articles from {source}, generate a summary in JSON format:\
            {articles}\

            Each article contains:
            - id: unique identifier
            - title: article title
            - description: article content
            - categories: optional category information (if available)

            Allowed Categories: {categories}\

            If an article has 'categories', use it as additional context for categorization.

            Language: english\

            Return JSON with the following fields:\
            - summaries: a dict where keys are category names and values are detailed summaries 
              (5-7 sentences) of the articles that belong to the specific category\
            - categories: a dict where keys are category names and values are article counts\
            - references: a dict where keys are category names and values are lists of article IDs 
              corresponding strictly to the articles summarized in the category.\

            Constraints:
            - You must include keys for every category listed in allowed categories.
            - Handling empty data (if a category has no articles):
              - In "summaries": set the value to an empty string "".
              - In "categories": set the value to 0.
              - In "references": set the value to an empty list [].

            IMPORTANT: Return ONLY raw JSON. Do NOT wrap it in markdown code blocks. Do NOT use ```json or ``` markers.
        """
        )

    @property
    def periodic_summary_prompt(self):
        return ChatPromptTemplate.from_template(
            """
            Based on the following daily summaries, generate a periodic summary in JSON format:\

            Input data:\
            {daily_summaries}\

            Structure explanation:\
            The input data is organized hierarchically: Day -> Source -> Category.\
            - "summaries": Source -> Category -> Text content.\
            - "categories": Source -> Category -> Integer count.\
            - "references": Source -> Category -> List of article IDs and titles.\
            
            Your task:\
            1. Aggregate information across all days.\
            2. Aggregate counts for the same category accross all sources.\
            3. Use the provided "summaries" text to write the main summary and highlights\
            
            Language: english\

            Return JSON with the following fields:\
            - main_summary: a narrative (8–12 sentences) synthesizing the main themes and events across the period.\
            - categories_timeline: a list of objects, where each object represents one day and contains:\
              * date: the date in YYYY-MM-DD format\
              * one field per category (e.g., Technology, Politics, Economy, Sport, Culture) with the total count for
                that day (summed across all sources)\
            - category_totals: a dict with total counts per category for the entire period.\
            - trends: A dictionary containing three specific lists (each item: 3-5 words max):
              * rising: Topics gaining momentum (3-5 items).
              * declining: Topics that faded (3-5 items).
              * emerging: New topics that appeared late (3-5 items).
            - key_insights: 5–10 bullet points covering the most critical findings.\
            - source_highlights: a dict (Key: Source Name, Value: 3-5 sentence summary of that source's focus).\
            - event_timeline: a dict (Key: YYYY-MM-DD, Value: Description of key events).
              For dates with events, provide a detailed description. Do NOT leave empty strings
              unless there are truly no events.\
            - references: a dict (Key: Source Name, Value: List of top 5 most important article IDs (only integers)
              that were DIRECTLY USED to write the source_highlights for that source).
              The referenced articles must be the ones that best represent the focus described in "source_highlights".
              EXAMPLE: {{"BBC": [101, 102, 103], "TVN24": [104, 105]}}, DO NOT include categories in references
              
            
            Target JSON Structure (Example):
            {{
                "main_summary": "string - detailed narrative",
                "categories_timeline": [
                    {{ "date": "2026-01-11", "Sport": 10, "Technology": 5, "Politics": 0, "Economy": 2, "Culture": 8 }},
                    {{ "date": "2026-01-12", "Sport": 12, "Technology": 7, "Politics": 3, "Economy": 1, "Culture": 5 }}
                ],
                "category_totals": {{
                    "Sport": 100,
                    "Technology": 50,
                    "Politics": 30,
                    "Economy": 20,
                    "Culture": 15
                }},
                "trends": {{
                    "rising": ["Topic A", "Topic B", "Topic C", "Topic D"],
                    "declining": ["Topic E", "Topic F", "Topic G"],
                    "emerging": ["Topic H", "Topic I", "Topic J", "Topic K", "Topic L"]
                }},
                "key_insights": [
                    "Insight",
                    "Insight"
                ],
                "source_highlights": {{
                    "BBC": "Summary of BBC coverage...",
                    "TVN24": "Summary of TVN24 coverage..."
                }},
                "event_timeline": {{
                    "2026-01-01": "Description of events on this day. It must be a SINGLE STRING, not a list.",
                    "2026-01-02": "Another event description combining all events of that day."
                }},
                "references": {{
                    "BBC": [101, 102, 103],
                    "TVN24": [104, 105]
                }}
            }}
              
              Do NOT use trailing commas (commas after the last element in lists or objects).
              - CORRECT: {{ "key": "value" }}
              - WRONG:   {{ "key": "value", }}

            IMPORTANT: Return ONLY raw JSON. Do NOT wrap it in markdown code blocks. Do NOT use ```json or ``` markers.
            IMPORTANT: Do NOT use double quotes (") inside the summary text. Use single quotes (') instead to avoid
            breaking JSON syntax.
        """
        )

    def get_daily_summary_for_source(
        self, articles: list[Article], source: str, summary_date: date
    ) -> dict:
        if not articles:
            empty_categories = {cat: "" for cat in self.settings.article_categories}
            empty_counts = {cat: 0 for cat in self.settings.article_categories}
            empty_refs = {cat: [] for cat in self.settings.article_categories}
            return {
                "summaries": {source: empty_categories},
                "categories": {source: empty_counts},
                "references": {source: empty_refs},
            }

        articles_description = "\n".join(
            [article.full_description for article in articles]
        )

        daily_summary_chain = (
            self.daily_summary_for_source_prompt | self.model | StrOutputParser()
        )

        raw_content = daily_summary_chain.invoke(
            {
                "articles": articles_description,
                "source": source,
                "categories": self.summary_categories,
            }
        )

        clean_content = raw_content.strip()
        if clean_content.startswith("```json"):
            clean_content = clean_content[7:]
        elif clean_content.startswith("```"):
            clean_content = clean_content[3:]
        if clean_content.endswith("```"):
            clean_content = clean_content[:-3]
        clean_content = clean_content.strip()

        try:
            output = json.loads(clean_content, strict=False)
            return {
                "summaries": {source: output.get("summaries", {})},
                "categories": {source: output.get("categories", {})},
                "references": {source: output.get("references", {})},
            }
        except json.JSONDecodeError:
            raise ValueError("Failed to parse LLM output.")

    def get_periodic_summary(
        self,
        daily_summaries: list[DailySummary],
        sources: list[str],
        categories: list[str],
        start_date: date,
        end_date: date,
    ):
        for summary in daily_summaries:
            summary.summaries = {
                src: {
                    category: value
                    for category, value in data.items()
                    if category in categories
                }
                for src, data in summary.summaries.items()
                if src in sources
            }

            summary.categories = {
                src: {
                    category: value
                    for category, value in data.items()
                    if category in categories
                }
                for src, data in summary.categories.items()
                if src in sources
            }

            summary.references = {
                src: {
                    category: value
                    for category, value in data.items()
                    if category in categories
                }
                for src, data in summary.references.items()
                if src in sources
            }

        periodic_summary_chain = (
            self.periodic_summary_prompt | self.model | StrOutputParser()
        )

        raw_content = periodic_summary_chain.invoke(
            {"daily_summaries": daily_summaries}
        )

        clean_content = raw_content.strip()
        if clean_content.startswith("```json"):
            clean_content = clean_content[7:]
        elif clean_content.startswith("```"):
            clean_content = clean_content[3:]
        if clean_content.endswith("```"):
            clean_content = clean_content[:-3]
        clean_content = clean_content.strip()

        try:
            output = json.loads(clean_content, strict=False)
            return PeriodicSummary(
                start_date=start_date,
                end_date=end_date,
                main_summary=output["main_summary"],
                categories_timeline=output["categories_timeline"],
                category_totals=output["category_totals"],
                trends=output["trends"],
                key_insights=output["key_insights"],
                source_highlights=output["source_highlights"],
                event_timeline=output["event_timeline"],
                references=output["references"],
            )
        except json.JSONDecodeError:
            raise ValueError("Failed to parse LLM output.")

from app.agents.agent_config import AgentSettings
from app.schemas.article import Article
from app.schemas.daily_summary import DailySummary
from app.schemas.periodic_summary import PeriodicSummary

from datetime import date

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv


load_dotenv()

""" NEED TO CONSIDER PARALLEL CHAINING FOR BETTER PERFORMANCE (ACCURACY - TIME RATIO) """


class SummaryAgent:
    def __init__(self, model: str, settings: AgentSettings):
        self.settings = settings
        self.model = model
        self.summary_categories = ", ".join(self.settings.article_categories)
        self.summary_sources = ", ".join(self.settings.sources)
        self.daily_summary_id = 0

    @property
    def daily_summary_prompt(self):
        return ChatPromptTemplate.from_template(
            """
            Based on the following articles, generate a summary in JSON format:\
            {articles}\
            
            Each article contains:
            - id: unique identifier
            - title: article title
            - description: article content
            - source: news source name
            - categories: optional category information (if available)
            
            You must include all sources and categories from the following lists,
            without additional keys like "no source", "default" etc.\
            - Allowed Sources: {sources}
            - Allowed Categories: {categories}\
            
            If an article has 'categories', use it as additional context for categorization.
            
            Language: english\
            
            Return JSON with the following fields:\
            - summaries: a dict where keys are source names. The value must be a nested dictionary
              where keys are category names and values are detailed summaries (5-7 sentences) of the
              articles from that source that belong to the specific category\
            - categories: a dict where keys are source names. The value must be a nested dictionary
              containing article counts for each allowed category\
            - references: a dict where keys are soucre names. The value must be a nested dictionary
              where keys are category names and values are lists of articles IDs corresponding strictly
              to the articles summarized in the category.\
            
            Constraints:
            - You must include keys for every source listed in allowed sources.
            - Inside each source, you must include keys for every category listed in allowed categories.
    
            - Handling empty data (if a category has no articles for a source):
              - In "summaries": set the value to an empty string "".
              - In "categories": set the value to 0.
              - In "references": set the value to an empty list [].
            
            Return only JSON, without additional text.
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
              * one field per category (e.g., Technology, Politics, Economy, Sport, Culture) with the total count for that day (summed across all sources)\
              Example: [{{ "date": "2025-11-01", "Technology": 50, "Politics": 30, "Economy": 20, "Sport": 40, "Culture": 60 }}, {{ "date": "2025-11-02", ... }}]\
            - category_totals: a dict with total counts per category for the entire period.\
            - trends: A dictionary containing three specific lists:\
                * rising: Topics that are gaining momentum or frequency over the period.\
                * declining: Topics that were prominent at the start but faded.\
                * emerging: Completely new topics that appeared late in the period.\
            - key_insights: 5–10 bullet points covering the most critical findings.\
            - source_highlights: a dict (Key: Source Name, Value: 1-3 sentence summary of that source's focus).\
            - event_timeline: a dict (Key: YYYY-MM-DD, Value: Description of key events).\
            - references: a dict (Key: Source Name, Value: List of top 5 most important articles IDs (only integer) found in the input for that source).\

            Return only JSON, with no additional explanations.\
        """
        )

    def get_daily_summary(
        self, articles: list[Article], summary_date: date
    ) -> DailySummary:
        articles_description = "\n".join(
            [article.full_description for article in articles]
        )

        daily_summary_chain = (
            self.daily_summary_prompt
            | self.model
            | JsonOutputParser(pydantic_object=DailySummary)
        )
        output = daily_summary_chain.invoke(
            {
                "articles": articles_description,
                "sources": self.summary_sources,
                "categories": self.summary_categories,
            }
        )

        return DailySummary(
            date=summary_date,
            summaries=output["summaries"],
            categories=output["categories"],
            references=output["references"],
        )

    def get_periodic_summary(
        self,
        daily_summaries: list[DailySummary],
        sources: list[str],
        categories: list[str],
        start_date: date,
        end_date: date,
    ):
        periodic_summary_chain = (
            self.periodic_summary_prompt
            | self.model
            | JsonOutputParser(pydantic_object=PeriodicSummary)
        )

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

        output = periodic_summary_chain.invoke({"daily_summaries": daily_summaries})

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

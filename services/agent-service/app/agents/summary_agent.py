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
            You must include all sources from the following list {sources}, without additional
            keys like "no source", "default" etc.\
            
            Language: english\
            
            Return JSON with the following fields:\
            - summaries: a dict where each key is a source name and each value is a detailed summary 
              (at least 5–7 sentences) describing the main events, topics, and trends covered by articles 
              from that specific source.\
            - categories: a dict where each key is a source name and each value 
              is another dict containing category counts for that specific source, if none return 0 for each category 
              (keys: {categories})\
            - references: a dict where each key is a source name and each value is a list of 
              3–5 the most important articles URLs from that specific source.\
            
            Return only JSON, without additional info.
        """
        )

    @property
    def periodic_summary_prompt(self):
        return ChatPromptTemplate.from_template(
            """
            Based on the following daily summaries, generate a periodic summary in JSON format:\

            {daily_summaries}\

            You must aggregate information across all days in the period.\
            
            Language: english\

            Return JSON with the following fields:\
            - main_summary: a comprehensive narrative (8–12 sentences) describing the main themes, events,
              and developments across the entire period.\
            - categories_timeline: a dict where keys are category names and values are lists of integers
              representing daily counts in chronological order.\
            - category_totals: total count per category across the whole period.\
            - trends: a list of observed trends, including rising topics, declining topics,
              emerging themes, and notable shifts.\
            - key_insights: 5–10 short bullet-style statements highlighting the most important findings.\
            - source_highlights: a dict where keys are source names and values are 1–3 sentence summaries
              of what each source focused on over the period.\
            - event_timeline: a dict where keys are dates (YYYY-MM-DD) and values are short descriptions
              of key events that occurred on that day, combining information from all sources.\
            - references: a dict where keys are source names and values are lists of article URLs
              that were included in the summaries for that source.\

            Return only JSON, with no additional explanations.
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
        self.daily_summary_id += 1

        print(output)

        return DailySummary(
            id=self.daily_summary_id,
            date=summary_date,
            summaries=output["summaries"],
            categories=output["categories"],
            references=output["references"],
        )

    def get_periodic_summary(
        self, daily_summaries: list[DailySummary], sources: list[str], start_date: date, end_date: date
    ):
        periodic_summary_chain = (
            self.periodic_summary_prompt
            | self.model
            | JsonOutputParser(pydantic_object=PeriodicSummary)
        )

        for summary in daily_summaries:
            summary.summaries = {
                k: v for k, v in summary.summaries.items() if k in sources
            }

            summary.categories = {
                k: v for k, v in summary.categories.items() if k in sources
            }

            summary.references = {
                k: v for k, v in summary.references.items() if k in sources
            }

        output = periodic_summary_chain.invoke({"daily_summaries": daily_summaries})

        print(output)

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
        )

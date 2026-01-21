from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
import httpx

from contextlib import asynccontextmanager
from datetime import date
import logging
import os

scheduler = AsyncIOScheduler()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


SCRAPER_URL = os.getenv("SCRAPER_URL", "http://data-service:8082/articles")
AGENT_URL = os.getenv("AGENT_URL", "http://agent-service:8083/daily_summary")


async def trigger_scraping_job():
    logger.info("Data Scrapping starts...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(SCRAPER_URL, timeout=180)
            logger.info(f"Scraping status: {response.status_code}")
            logger.info(f"Scraping response: {response.text}")

        except Exception as e:
            logger.error(
                f"Internal Error occured in data scraper service during scraping articles: {e}"
            )


async def trigger_agent_summary_job():
    logger.info("Preparing daily summary starts...")
    async with httpx.AsyncClient() as client:
        try:
            today = date.today().isoformat()
            response = await client.post(
                AGENT_URL.format(today),
                params={"summary_date": today},
                timeout=600,
            )
            logger.info(
                f"Agent service generated daily info summary for {today} - status: {response.status_code}"
            )

        except Exception as e:
            logger.error(
                f"Internal Error occured in agent service during daily summary generation: {e}"
            )


scheduler.add_job(trigger_scraping_job, "cron", hour=12, minute=0)
scheduler.add_job(trigger_scraping_job, "cron", hour=23, minute=45)
scheduler.add_job(trigger_agent_summary_job, "cron", hour=23, minute=55)


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    logger.info("Scheduler task has been started in background.")
    try:
        yield
    finally:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler został zatrzymany.")

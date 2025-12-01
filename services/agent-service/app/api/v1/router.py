from fastapi import APIRouter
from .endpoints import daily_summaries, articles

api_router = APIRouter()

api_router.include_router(daily_summaries.router)
api_router.include_router(articles.router)

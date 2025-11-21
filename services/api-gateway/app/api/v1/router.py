from fastapi import APIRouter
from .endpoints import articles

api_router = APIRouter()

api_router.include_router(articles.router)

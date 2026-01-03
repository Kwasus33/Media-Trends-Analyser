from app.services.article_service import ScraperService

from fastapi import APIRouter, Query

router = APIRouter(prefix="/articles", responses={404: {"description": "Not found"}})
scraper_service = ScraperService()

# need to think of adding start/end datetime for scrapping api with timestamp,
# can be added as separate enpoint if api would be separated to rss, api enpoints or start/end can be query params

# those enpoints can be used by client for generating live (tho calculations-demanding) results


@router.get("/all")
async def get_all_articles(limit: int | None = Query(default=None, ge=1)):
    """
    Gets all available articles from online sources like APIs and RSS feeds
    """
    return (
        scraper_service.fetch_all_articles(limit)
        if limit
        else scraper_service.fetch_all_articles()
    )


@router.get("/{source}")
@router.get("/{source}/{category}")
async def get_articles(source: str, category: str | None = None):
    """
    Gets latest available articles from online sources like APIs and RSS feeds

    :param source: name of accessed source e.g. RSS, API
    :type source: str
    :param category: catrgory of source entries to get, None if source categories are not defined
    :type category: str | None
    """
    return scraper_service.fetch_articles(source, category)

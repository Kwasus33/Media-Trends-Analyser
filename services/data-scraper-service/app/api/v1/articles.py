from app.scrapers.base_scraper import API_SCRAPERS
from app.core.config import CONTEXT

from fastapi import APIRouter, HTTPException

# import os


router = APIRouter(
    prefix="/articles", tags="articles", responses={404: {"description": "Not found"}}
)

# need to think of adding start/end datetime for scrapping api with timestamp,
# can be added as separate enpoint if api would be separated to rss, api enpoints or start/end can be query params

# those enpoints can be used by client for generating live (tho calculations-demanding) results


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
    try:
        source_data = CONTEXT[source]
        base_url = source_data["endpoint"]["base_url"]
        scraper = API_SCRAPERS[source_data["type"]]

    except HTTPException(
        status_code=404, detail="Item not found - wrong data passed"
    ) as e:
        print(
            f"Invalid query path - source or category does not match available ones: {e}"
        )

    if category and category not in source_data["endpoint"]["categories"]:
        raise HTTPException("Item not found - wrong category passed")

    if not category and source_data["endpoint"]["categories"]:
        category = source_data["endpoint"]["categories"][0]

    scraper = scraper(base_url)

    return scraper.collect_data(category)

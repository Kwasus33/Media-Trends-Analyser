from unittest.mock import MagicMock, patch

import pytest
from app.services.article_service import ScraperService

MOCK_CONTEXT = {
    "test_source": {
        "type": "rss",
        "title": "Test Source",
        "endpoint": {
            "base_url": "http://kacpersiemionek.com",
            "categories": ["Technology"],
        },
    }
}


# --- FIXTURES ---
@pytest.fixture
def service():
    if hasattr(ScraperService, "instance"):
        del ScraperService.instance
    return ScraperService()


# --- UNIT TESTS ---
@patch("app.services.article_service.CONTEXT", MOCK_CONTEXT)
@patch("app.services.article_service.API_SCRAPERS")
def test_fetch_articles_success(mock_scrapers, service):
    mock_scraper_class = MagicMock()
    mock_scrapers.__contains__.return_value = True
    mock_scrapers.__getitem__.return_value = mock_scraper_class

    mock_instance = mock_scraper_class.return_value
    mock_instance.collect_data.return_value = [{"title": "Art 1"}]

    result = service.fetch_articles("test_source", category="Technology")

    assert len(result) == 1
    assert result[0]["title"] == "Art 1"
    mock_instance.collect_data.assert_called_once_with("Technology")


@patch("app.services.article_service.CONTEXT", MOCK_CONTEXT)
def test_fetch_articles_invalid_source(service):
    with pytest.raises(ValueError) as exc:
        service.fetch_articles("non_existent")
    assert "not found" in str(exc.value)


@patch("app.services.article_service.CONTEXT", MOCK_CONTEXT)
@patch("app.services.article_service.API_SCRAPERS")
def test_fetch_all_articles_aggregation(mock_scrapers, service):
    mock_scraper_class = MagicMock()
    mock_scrapers.__contains__.return_value = True
    mock_scrapers.__getitem__.return_value = mock_scraper_class
    mock_instance = mock_scraper_class.return_value

    mock_instance.collect_data.return_value = [{"title": "Test test test 123"}]

    result = service.fetch_all_articles()

    assert len(result) == 1
    assert result[0]["title"] == "Test test test 123"


@patch("app.services.article_service.CONTEXT", MOCK_CONTEXT)
@patch("app.services.article_service.API_SCRAPERS")
def test_fetch_all_articles_with_limit(mock_scrapers, service):
    mock_scraper_class = MagicMock()
    mock_scrapers.__contains__.return_value = True
    mock_scrapers.__getitem__.return_value = mock_scraper_class
    mock_instance = mock_scraper_class.return_value

    mock_instance.collect_data.return_value = [{"t": i} for i in range(5)]

    result = service.fetch_all_articles(limit_per_source=2)

    assert len(result) == 2

from unittest.mock import patch
import pytest
from app.core.db import get_db
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# --- FIXTURES ---


@pytest.fixture
def override_db(db_session):
    def _get_db_override():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_db_override
    yield
    app.dependency_overrides.clear()


# --- UNIT TESTS ---


def test_get_all_articles_api(override_db):
    with patch("app.api.v1.articles.scraper_service.fetch_all_articles") as mock_fetch:
        full_article = {
            "title": "ROXIE WĘGIEL ZAŁOŻYŁA TO DO SKLEPU!? [ZOBACZ ZDJĘCIA]",
            "description": "Kacper Siemionek",
            "url": "http://kacpersiemionek.pl",
            "source": "Pudelek",
            "published_at": "2026-01-22T12:00:00",
            "categories": [],
        }
        mock_fetch.return_value = [full_article]

        response = client.get("/articles/all?limit=5")

        assert response.status_code == 200
        assert response.json()[0]["title"] == full_article["title"]
        mock_fetch.assert_called_once_with(5)


def test_get_articles_by_source_and_category(override_db):
    with patch("app.api.v1.articles.scraper_service.fetch_articles") as mock_fetch:
        full_article = {
            "title": "Filtered Article",
            "description": "Siemionek Kacper",
            "url": "http://kacpersiemionek.com",
            "source": "RSS",
            "published_at": "2026-01-22T12:00:00",
            "categories": ["Technology"],
        }
        mock_fetch.return_value = [full_article]

        response = client.get("/articles/RSS/Technology")

        assert response.status_code == 200
        assert response.json()[0]["title"] == "Filtered Article"
        mock_fetch.assert_called_once_with("RSS", "Technology")

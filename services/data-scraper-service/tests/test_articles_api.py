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
        mock_fetch.return_value = [
            {"title": "ROXIE WĘGIEL ZAŁOŻYŁA TO DO SKLEPU!? [ZOBACZ ZDJĘCIA]"}
        ]

        response = client.get("/articles/all?limit=5")

        assert response.status_code == 200
        assert response.json() == [
            {"title": "ROXIE WĘGIEL ZAŁOŻYŁA TO DO SKLEPU!? [ZOBACZ ZDJĘCIA]"}
        ]
        mock_fetch.assert_called_once_with(5)


def test_save_articles_api_success(override_db):
    payload = [
        {
            "title": "ROXIE WĘGIEL ZAŁOŻYŁA TO DO SKLEPU!? [ZOBACZ ZDJĘCIA]",
            "description": "Fani w szoku, czy ona oszalała?!",
            "url": "http://api-test.com",
            "published_at": "2026-01-17T21:00:00",
            "source": "API",
            "categories": ["Technology"],
        }
    ]

    response = client.post("/articles/articles", json=payload)

    assert response.status_code == 200
    assert response.json()["status"] == "SUCCESS"
    assert response.json()["new_saved"] == 1


def test_save_articles_api_validation_error(override_db):
    payload = [{"title": "No URL Article"}]

    response = client.post("/articles/articles", json=payload)

    assert response.status_code == 422

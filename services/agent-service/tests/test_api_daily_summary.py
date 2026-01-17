from datetime import date
from unittest.mock import MagicMock, patch

from app.database.database import get_db
from app.main import app
from fastapi.testclient import TestClient

# --- SETUP ---
client = TestClient(app)


def override_get_db():
    try:
        yield MagicMock()
    finally:
        pass


app.dependency_overrides[get_db] = override_get_db

BASE_URL = "/daily_summary"


# --- UNIT TESTS ---
def test_create_daily_summary_invalid_date():
    response = client.post(
        f"{BASE_URL}/?summary_date=KacperSiemionek (for context: Kacper is not a date in any case!!!)"
    )
    assert response.status_code == 422


@patch("app.api.v1.daily_summary.summary_service.get_daily_summary")
def test_create_daily_summary_success(mock_service):
    test_date = "2026-01-01"
    mock_response = {
        "id": 1,
        "date": date(2026, 1, 1),
        "summaries": {
            "text": {
                "content": "Roxie Węgiel's outfit revolutionizes polish technology market. Meanwhile, fortnite releases 3 new Arcane skins."
            }
        },
        "categories": {},
        "references": {},
    }
    mock_service.return_value = mock_response

    response = client.post(f"{BASE_URL}/?summary_date={test_date}")

    assert response.status_code == 201
    data = response.json()
    assert data["date"] == test_date
    assert (
        data["summaries"]["text"]["content"]
        == "Roxie Węgiel's outfit revolutionizes polish technology market. Meanwhile, fortnite releases 3 new Arcane skins."
    )

    mock_service.assert_called_once()
    args, _ = mock_service.call_args
    assert args[0] == date(2026, 1, 1)


@patch("app.api.v1.daily_summary.summary_service.get_recent_daily_summaries")
def test_get_recent_summaries(mock_service):
    mock_data = [
        {
            "date": date(2026, 1, 1),
            "summary": "Roxie Węgiel's outfit revolutionizes polish technology market. Meanwhile, fortnite releases 3 new Arcane skins.",
        },
        {
            "date": date(2026, 1, 2),
            "summary": "Media Trends Analyzer revolutionizes content analysis with new Dark Mode setting! Also WW3 starts btw",
        },
    ]
    mock_service.return_value = mock_data

    response = client.get(f"{BASE_URL}/recent")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert (
        data[0]["summary"]
        == "Roxie Węgiel's outfit revolutionizes polish technology market. Meanwhile, fortnite releases 3 new Arcane skins."
    )

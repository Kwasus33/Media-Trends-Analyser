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

BASE_URL = "/periodic_summary"

# --- TESTS ---


@patch("app.api.v1.periodic_summary.summary_service.get_periodic_summary")
def test_get_periodic_summary_success(mock_service):
    start_date = "2026-01-01"
    end_date = "2026-01-07"

    mock_response = {
        "start_date": date(2026, 1, 1),
        "end_date": date(2026, 1, 7),
        "main_summary": "Weekly report: AI is taking over. First terminators spotted in Warsaw.",
        "articles_processed": 10,
    }
    mock_service.return_value = mock_response

    response = client.get(
        f"{BASE_URL}/"
        f"?start={start_date}"
        f"&end={end_date}"
        f"&sources=BBC&sources=TVN24"
        f"&categories=Technology&categories=Politics"
    )

    assert response.status_code == 200

    data = response.json()
    assert (
        data["main_summary"]
        == "Weekly report: AI is taking over. First terminators spotted in Warsaw."
    )

    mock_service.assert_called_once()
    args, _ = mock_service.call_args

    assert args[0] == date(2026, 1, 1)
    assert args[1] == date(2026, 1, 7)
    assert args[2] == ["BBC", "TVN24"]
    assert args[3] == ["Technology", "Politics"]

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


@patch("app.api.v1.periodic_summary.task_service.create_task")
@patch("app.api.v1.periodic_summary.task_service.generate_summary_task")
def test_start_periodic_summary_success(mock_generate, mock_create):
    start_date = "2026-01-01"
    end_date = "2026-01-07"

    response = client.post(
        f"{BASE_URL}/start"
        f"?start={start_date}"
        f"&end={end_date}"
        f"&sources=BBC&sources=TVN24"
        f"&categories=Technology&categories=Politics"
    )

    assert response.status_code == 200
    data = response.json()
    assert "task_id" in data
    assert isinstance(data["task_id"], str)
    mock_create.assert_called_once()


def test_start_periodic_summary_missing_params():
    response = client.post(
        f"{BASE_URL}/start?end=2026-01-01&sources=BBC&categories=Technology"
    )
    assert response.status_code == 422


@patch("app.api.v1.periodic_summary.task_service.get_task")
def test_get_task_status_success(mock_get_task):
    task_id = "test-task-123"
    mock_get_task.return_value = {
        "status": "completed",
        "result": {
            "main_summary": "AI is taking over. First terminators spotted in Warsaw.",
        },
        "error": None,
    }

    response = client.get(f"{BASE_URL}/status/{task_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["task_id"] == task_id
    assert data["status"] == "completed"
    assert "main_summary" in data["result"]
    mock_get_task.assert_called_once_with(task_id)


@patch("app.api.v1.periodic_summary.task_service.get_task")
def test_get_task_status_failed(mock_get_task):
    task_id = "failed-task-456"
    mock_get_task.return_value = {
        "status": "failed",
        "result": None,
        "error": "Database connection lost",
    }

    response = client.get(f"{BASE_URL}/status/{task_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "failed"
    assert data["error"] == "Database connection lost"

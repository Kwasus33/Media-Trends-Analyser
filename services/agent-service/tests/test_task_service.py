import pytest
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from unittest.mock import MagicMock, patch
from app.services import task_service
from app.schemas.task_status import TaskStatus


@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)


def test_create_task():
    task_service.create_task("jd3198jw8asd0j9j21")
    task = task_service.get_task("jd3198jw8asd0j9j21")
    assert task["status"] == TaskStatus.PROCESSING
    task_service.delete_task("jd3198jw8asd0j9j21")


def test_update_task_result():
    task_service.create_task("jd3198jw8asd0j9j21")
    task_service.update_task_result("jd3198jw8asd0j9j21", {"data": "result"})
    task = task_service.get_task("jd3198jw8asd0j9j21")
    assert task["status"] == TaskStatus.COMPLETED
    assert task["result"]["data"] == "result"
    task_service.delete_task("jd3198jw8asd0j9j21")


def test_update_task_error():
    task_service.create_task("jd3198jw8asd0j9j21")
    task_service.update_task_error("jd3198jw8asd0j9j21", "Error")
    task = task_service.get_task("jd3198jw8asd0j9j21")
    assert task["status"] == TaskStatus.FAILED
    assert task["error"] == "Error"
    task_service.delete_task("jd3198jw8asd0j9j21")


def test_get_task_not_found():
    task_service.tasks.clear()
    task = task_service.get_task("jd3198jw8asd0j9j21")
    assert task["status"] == TaskStatus.NOT_FOUND


def test_delete_task():
    task_service.create_task("jd3198jw8asd0j9j21")
    result = task_service.delete_task("jd3198jw8asd0j9j21")
    assert result is True
    result = task_service.delete_task("jd3198jw8asd0j9j21")
    assert result is False


def test_cleanup_expired_tasks():
    task_service.create_task("jd3198jw8asd0j9j21")
    task_service.tasks["jd3198jw8asd0j9j21"]["created_at"] = datetime.now() - timedelta(
        seconds=4000
    )

    task_service.cleanup_expired_tasks()

    assert "jd3198jw8asd0j9j21" not in task_service.tasks


@patch("app.services.task_service.get_periodic_summary")
def test_generate_summary_task_success(mock_get_summary, mock_db):
    mock_get_summary.return_value = MagicMock(model_dump=lambda: {"data": "summary"})

    task_service.create_task("jd3198jw8asd0j9j21")
    task_service.generate_summary_task(
        "jd3198jw8asd0j9j21",
        date(2026, 1, 11),
        date(2026, 1, 16),
        ["BBC"],
        ["Technology"],
        mock_db,
    )

    task = task_service.get_task("jd3198jw8asd0j9j21")
    assert task["status"] == TaskStatus.COMPLETED
    assert task["result"] == {"data": "summary"}
    task_service.delete_task("jd3198jw8asd0j9j21")


@patch("app.services.task_service.get_periodic_summary")
def test_generate_summary_task_failure(mock_get_summary, mock_db):
    mock_get_summary.side_effect = Exception("Error")

    task_service.create_task("jd3198jw8asd0j9j21")
    task_service.generate_summary_task(
        "jd3198jw8asd0j9j21",
        date(2026, 1, 11),
        date(2026, 1, 16),
        ["BBC"],
        ["Technology"],
        mock_db,
    )

    task = task_service.get_task("jd3198jw8asd0j9j21")
    assert task["status"] == TaskStatus.FAILED
    task_service.delete_task("jd3198jw8asd0j9j21")

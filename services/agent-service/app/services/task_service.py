import asyncio
import logging
from typing import Any
from datetime import datetime, date
from app.schemas.task_status import TaskStatus
from sqlalchemy.orm import Session
from app.services.summary_service import get_periodic_summary


logger = logging.getLogger(__name__)

tasks: dict[str, dict[str, Any]] = {}
TASK_TTL_SECONDS = 3600
cleanup_task: asyncio.Task | None = None


def create_task(task_id: str) -> None:
    tasks[task_id] = {
        "status": TaskStatus.PROCESSING,
        "result": None,
        "error": None,
        "created_at": datetime.now(),
    }


def update_task_result(task_id: str, result: Any) -> None:
    if task_id in tasks:
        tasks[task_id]["status"] = TaskStatus.COMPLETED
        tasks[task_id]["result"] = result
        tasks[task_id]["completed_at"] = datetime.now()


def update_task_error(task_id: str, error: str) -> None:
    if task_id in tasks:
        tasks[task_id]["status"] = TaskStatus.FAILED
        tasks[task_id]["error"] = error
        tasks[task_id]["completed_at"] = datetime.now()


def get_task(task_id: str) -> dict[str, Any]:
    task = tasks.get(task_id)
    if not task:
        return {
            "task_id": task_id,
            "status": TaskStatus.NOT_FOUND,
            "result": None,
            "error": f"Task with id {task_id} does not exist or has expired.",
        }
    return task


def delete_task(task_id: str) -> bool:
    return tasks.pop(task_id, None) is not None


def cleanup_expired_tasks() -> None:
    now = datetime.now()
    expired = [
        tid
        for tid, task in tasks.items()
        if (now - task.get("created_at", now)).total_seconds() > TASK_TTL_SECONDS
    ]
    if expired:
        for tid in expired:
            tasks.pop(tid, None)


async def periodic_cleanup():
    while True:
        await asyncio.sleep(300)
        cleanup_expired_tasks()
        logger.info("[Cleanup] tasks=%d", len(tasks))


def start_cleanup_task():
    global cleanup_task
    if cleanup_task is None:
        cleanup_task = asyncio.create_task(periodic_cleanup())


def stop_cleanup_task():
    global cleanup_task
    if cleanup_task:
        cleanup_task.cancel()
        cleanup_task = None


def generate_summary_task(
    task_id: str,
    start: date,
    end: date,
    sources: list[str],
    categories: list[str],
    db: Session,
):
    try:
        result = get_periodic_summary(start, end, sources, categories, db)
        update_task_result(task_id, result.model_dump())
    except Exception as e:
        logger.exception("[Task %s] Error generating summary", task_id)
        update_task_error(task_id, str(e))

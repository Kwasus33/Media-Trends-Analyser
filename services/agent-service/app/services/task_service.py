import asyncio
import logging
from typing import Any, Optional
from datetime import datetime
from app.schemas.task_status import TaskStatus

logger = logging.getLogger(__name__)

tasks: dict[str, dict[str, Any]] = {}
TASK_TTL_SECONDS = 3600
cleanup_task: Optional[asyncio.Task] = None


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
        return {"status": TaskStatus.PENDING}
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

from pydantic import BaseModel
from enum import Enum


class TaskStatus(str, Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    NOT_FOUND = "not_found"


class TaskStatusResponse(BaseModel):
    task_id: str
    status: TaskStatus
    result: dict | None = None
    error: str | None = None

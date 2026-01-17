from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import date
import uuid

from app.database.database import get_db
from app.schemas.task_status import TaskStatusResponse
from app.services import task_service

router = APIRouter(prefix="/periodic_summary")


@router.post("/start", response_model=dict)
def start_periodic_summary(
    background_tasks: BackgroundTasks,
    start: date = Query(...),
    end: date = Query(...),
    sources: list[str] = Query(...),
    categories: list[str] = Query(...),
    db: Session = Depends(get_db),
):
    task_id = str(uuid.uuid4())
    task_service.create_task(task_id)

    background_tasks.add_task(
        task_service.generate_summary_task,
        task_id,
        start,
        end,
        sources,
        categories,
        db,
    )

    return {"task_id": task_id}


@router.get("/status/{task_id}", response_model=TaskStatusResponse)
def get_task_status(task_id: str):
    task_data = task_service.get_task(task_id)
    return TaskStatusResponse(
        task_id=task_id,
        status=task_data.get("status"),
        result=task_data.get("result"),
        error=task_data.get("error"),
    )

from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.tasks import TaskResponse, TaskUpdate
from app.crud.tasks import get_tasks_by_worker, resolve_task
from datetime import datetime

router = APIRouter()

@router.get("/tasks/worker/{worker_id}", response_model=List[TaskResponse])
async def get_worker_tasks(worker_id: int):
    try:
        tasks = get_tasks_by_worker(worker_id)
        if not tasks:
            return []
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/tasks/{complaint_id}/resolve")
async def resolve_worker_task(complaint_id: int):
    try:
        success = resolve_task(complaint_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to resolve task")
        return {"message": "Task resolved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.tasks import TaskCreate, TaskUpdate, TaskResponse
from app.crud.tasks import get_tasks, create_task, update_task

router = APIRouter()

@router.get("/tasks/", response_model=List[TaskResponse])
async def fetch_tasks():
    return get_tasks()

@router.post("/tasks/", response_model=int)
async def add_task(task: TaskCreate):
    return create_task(task)

@router.put("/tasks/{task_id}")
async def mark_task_completed(task_id: int, task: TaskUpdate):
    update_task(task_id, task)
    return {"message": "Task updated successfully"}
from fastapi import APIRouter, HTTPException, Depends
from app.database.mongodb import get_collection
from app.schemas.tasks import TaskCreate, TaskResponse, TaskUpdate
from bson import ObjectId

router = APIRouter(prefix="/tasks", tags=["Tasks"])
tasks_collection = get_collection("tasks")

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate):
    task_data = task.dict()
    result = await tasks_collection.insert_one(task_data)
    return TaskResponse(id=str(result.inserted_id), **task.dict())

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task["id"] = str(task["_id"])
    return task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, task: TaskUpdate):
    update_result = await tasks_collection.update_one(
        {"_id": ObjectId(task_id)}, {"$set": task.dict(exclude_unset=True)}
    )
    if not update_result.modified_count:
        raise HTTPException(status_code=404, detail="Task not found or not updated")
    updated_task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    updated_task["id"] = str(updated_task["_id"])
    return updated_task

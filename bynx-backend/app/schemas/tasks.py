from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    description: str
    status: str

class TaskCreate(TaskBase):
    complaint_id: int
    location: str
    worker_id: int
    assigned_at: datetime = datetime.now()

class TaskUpdate(BaseModel):
    status: str

class TaskResponse(TaskBase):
    id: str
    complaint_id: int
    location: str
    worker_id: int
    assigned_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
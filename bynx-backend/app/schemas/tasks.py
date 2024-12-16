from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    description: str
    status: str

class TaskCreate(TaskBase):
    bin_id: int
    worker_id: int
    deadline: datetime

class TaskUpdate(BaseModel):
    status: str

class TaskResponse(TaskBase):
    id: str
    bin_id: int
    worker_id: int
    deadline: datetime
    created_at: datetime

    class Config:
        from_attributes = True
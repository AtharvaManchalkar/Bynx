from pydantic import BaseModel
from datetime import datetime

class TaskBase(BaseModel):
    bin_id: str
    worker_id: str
    status: str  # pending, in-progress, completed
    description: str

class TaskCreate(TaskBase):
    deadline: datetime

class TaskUpdate(BaseModel):
    status: str

class TaskResponse(TaskBase):
    id: str
    deadline: datetime

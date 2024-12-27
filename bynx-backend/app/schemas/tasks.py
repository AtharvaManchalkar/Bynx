from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    complaint_id: int
    status: str

class TaskUpdate(BaseModel):
    status: str = "Resolved"
    resolved_at: datetime = datetime.now()

class TaskResponse(BaseModel):
    complaint_id: int
    description: str
    submitted_at: datetime
    resolved_at: Optional[datetime]
    status: str
    location_id: Optional[int]
    address: Optional[str]
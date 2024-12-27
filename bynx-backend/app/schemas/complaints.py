from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintBase(BaseModel):
    description: str

class ComplaintCreate(ComplaintBase):
    user_id: int
    status: str = "Pending"

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    worker_id: Optional[int] = None
    resolved_at: Optional[datetime] = None

class ComplaintResponse(BaseModel):
    complaint_id: int
    description: str
    submitted_at: datetime
    resolved_at: Optional[datetime]
    status: str
    user_id: int
    location_id: Optional[int]
    assigned_to: Optional[str]
    worker_id: Optional[int]
    address: Optional[str]

    class Config:
        orm_mode = True
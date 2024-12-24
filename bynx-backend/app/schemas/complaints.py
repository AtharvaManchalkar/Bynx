from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintCreate(BaseModel):
    user_id: int
    location: str
    description: str
    status: str = "Pending"
    created_at: datetime = datetime.now()

class ComplaintUpdate(BaseModel):
    status: Optional[str]
    resolved_at: Optional[datetime]

class ComplaintResponse(BaseModel):
    complaint_id: int
    user_id: int
    location: str
    description: str
    status: str
    created_at: datetime
    assigned_to: Optional[str]
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True
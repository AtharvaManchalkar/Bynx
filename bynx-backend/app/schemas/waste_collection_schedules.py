from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WasteCollectionScheduleCreate(BaseModel):
    collection_date: datetime
    collected_at: Optional[datetime] = None
    status: str = "Scheduled"
    worker_id: int
    vehicle_id: int
    bin_id: int

class WasteCollectionScheduleUpdate(BaseModel):
    collection_date: Optional[datetime]
    collected_at: Optional[datetime]
    status: Optional[str]
    worker_id: Optional[int]
    vehicle_id: Optional[int]
    bin_id: Optional[int]

class WasteCollectionScheduleResponse(BaseModel):
    schedule_id: int
    collection_date: datetime
    collected_at: Optional[datetime]
    status: str
    worker_id: int
    vehicle_id: int
    bin_id: int

    class Config:
        from_attributes = True
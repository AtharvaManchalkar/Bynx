from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WasteRecordCreate(BaseModel):
    weight: float
    date_collected: datetime
    processing_center_id: int
    bin_id: int

class WasteRecordUpdate(BaseModel):
    weight: Optional[float]
    date_collected: Optional[datetime]
    processing_center_id: Optional[int]
    bin_id: Optional[int]

class WasteRecordResponse(BaseModel):
    record_id: int
    weight: float
    date_collected: datetime
    processing_center_id: int
    bin_id: int

    class Config:
        from_attributes = True
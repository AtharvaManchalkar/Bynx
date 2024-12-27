from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BinBase(BaseModel):
    current_level: int
    type: str
    location_id: int
    vehicle_id: Optional[int] = None
    last_emptied: Optional[datetime] = None

class BinUpdate(BaseModel):
    current_level: Optional[int] = None
    type: Optional[str] = None
    location_id: Optional[int] = None
    vehicle_id: Optional[int] = None
    last_emptied: Optional[datetime] = None

class BinResponse(BaseModel):
    bin_id: int
    current_level: int
    type: str
    location: dict
    vehicle_id: Optional[int] = None
    last_emptied: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True
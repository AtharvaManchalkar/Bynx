from pydantic import BaseModel
from typing import Optional
from app.schemas.locations import LocationResponse
from datetime import datetime

class BinBase(BaseModel):
    capacity: int
    current_level: int
    status: str  # full, empty, damaged
    last_collected: Optional[str]  # Change to Optional[str]

class BinCreate(BinBase):
    location_id: int

class BinUpdate(BaseModel):
    location_id: int
    capacity: int
    current_level: int
    status: str
    last_collected: Optional[str]  # Change to Optional[str]

class BinResponse(BinBase):
    bin_id: int
    location: LocationResponse

    class Config:
        orm_mode = True
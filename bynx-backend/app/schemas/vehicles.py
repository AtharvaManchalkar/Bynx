from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VehicleCreate(BaseModel):
    vehicle_number: str
    capacity: int
    last_maintenance: Optional[datetime] = None
    assigned_worker_id: Optional[int] = None
    location_id: int

class VehicleUpdate(BaseModel):
    vehicle_number: Optional[str]
    capacity: Optional[int]
    last_maintenance: Optional[datetime]
    assigned_worker_id: Optional[int]
    location_id: Optional[int]

class VehicleResponse(BaseModel):
    vehicle_id: int
    vehicle_number: str
    capacity: int
    last_maintenance: Optional[datetime]
    assigned_worker_id: Optional[int]
    location_id: int

    class Config:
        from_attributes = True
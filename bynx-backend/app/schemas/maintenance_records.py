from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MaintenanceRecordCreate(BaseModel):
    details: str
    cost: float
    maintenance_date: Optional[datetime] = None
    vehicle_id: int

class MaintenanceRecordUpdate(BaseModel):
    details: Optional[str]
    cost: Optional[float]
    maintenance_date: Optional[datetime]
    vehicle_id: Optional[int]

class MaintenanceRecordResponse(BaseModel):
    maintenance_id: int
    details: str
    cost: float
    maintenance_date: Optional[datetime]
    vehicle_id: int
    vehicle_number: str

    class Config:
        orm_mode = True
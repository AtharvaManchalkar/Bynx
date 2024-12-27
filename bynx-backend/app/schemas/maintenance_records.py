from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MaintenanceRecordCreate(BaseModel):
    details: str
    cost: float
    vehicle_id: int
    status: str = "Pending"

class MaintenanceRecordUpdate(BaseModel):
    status: str = "Completed"
    maintenance_date: datetime

class MaintenanceRecordResponse(BaseModel):
    maintenance_id: int
    details: str
    cost: float
    vehicle_id: int
    status: str
    maintenance_date: Optional[datetime] = None
    vehicle_number: Optional[str] = None

    class Config:
        from_attributes = True
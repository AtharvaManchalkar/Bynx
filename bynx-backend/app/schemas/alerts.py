from pydantic import BaseModel
from typing import Optional

class AlertCreate(BaseModel):
    type: str
    bin_id: int

class AlertUpdate(BaseModel):
    type: Optional[str]
    bin_id: Optional[int]

class AlertResponse(BaseModel):
    alert_id: int
    type: str
    bin_id: int

    class Config:
        from_attributes = True
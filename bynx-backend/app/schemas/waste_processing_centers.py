from pydantic import BaseModel
from typing import Optional

class WasteProcessingCenterCreate(BaseModel):
    address: str
    processing_type: str
    capacity: int
    contact_no: str

class WasteProcessingCenterUpdate(BaseModel):
    address: Optional[str]
    processing_type: Optional[str]
    capacity: Optional[int]
    contact_no: Optional[str]

class WasteProcessingCenterResponse(BaseModel):
    center_id: int
    address: str
    processing_type: str
    capacity: int
    contact_no: str

    class Config:
        from_attributes = True
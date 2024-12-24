from pydantic import BaseModel
from typing import Optional

class AnnouncementCreate(BaseModel):
    title: str
    details: str
    image_url: Optional[str] = None

class AnnouncementResponse(BaseModel):
    id: str
    title: str
    details: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
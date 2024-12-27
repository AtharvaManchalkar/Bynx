from pydantic import BaseModel

class LocationCreate(BaseModel):
    latitude: float
    longitude: float
    address: str

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    address: str

class LocationResponse(BaseModel):
    location_id: int
    latitude: float
    longitude: float
    address: str

    class Config:
        from_attributes = True
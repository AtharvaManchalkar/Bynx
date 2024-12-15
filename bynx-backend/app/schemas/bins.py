from pydantic import BaseModel

class BinBase(BaseModel):
    location: str
    capacity: int
    current_level: int
    status: str  # full, empty, damaged
    last_collected: str

class BinCreate(BinBase):
    pass

class BinUpdate(BaseModel):
    location: str
    capacity: int
    current_level: int
    status: str
    last_collected: str

class BinResponse(BinBase):
    bin_id: int
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.locations import LocationCreate, LocationUpdate, LocationResponse
from app.crud.locations import get_locations, create_location, update_location

router = APIRouter()

@router.get("/locations", response_model=List[LocationResponse])
async def fetch_locations():
    locations = get_locations()
    if locations is None:
        raise HTTPException(status_code=404, detail="Locations not found")
    return locations

@router.post("/locations", response_model=int)
async def add_location(location: LocationCreate):
    location_id = create_location(location)
    return location_id

@router.put("/locations/{location_id}")
async def update_existing_location(location_id: int, location: LocationUpdate):
    existing_location = get_locations()
    if not existing_location:
        raise HTTPException(status_code=404, detail="Location not found")
    update_location(location_id, location)
    return {"message": "Location updated successfully"}
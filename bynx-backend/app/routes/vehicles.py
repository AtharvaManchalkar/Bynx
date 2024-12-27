from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.vehicles import VehicleCreate, VehicleUpdate, VehicleResponse
from app.crud.vehicles import get_vehicles, create_vehicle, update_vehicle

router = APIRouter()

@router.get("/vehicles", response_model=List[VehicleResponse])
async def fetch_vehicles():
    vehicles = get_vehicles()
    if vehicles is None:
        raise HTTPException(status_code=404, detail="Vehicles not found")
    return vehicles

@router.post("/vehicles", response_model=int)
async def add_vehicle(vehicle: VehicleCreate):
    vehicle_id = create_vehicle(vehicle)
    return vehicle_id

@router.put("/vehicles/{vehicle_id}")
async def update_existing_vehicle(vehicle_id: int, vehicle: VehicleUpdate):
    existing_vehicle = get_vehicles()
    if not existing_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    update_vehicle(vehicle_id, vehicle)
    return {"message": "Vehicle updated successfully"}
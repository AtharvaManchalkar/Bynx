from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.waste_collection_schedules import WasteCollectionScheduleCreate, WasteCollectionScheduleUpdate, WasteCollectionScheduleResponse
from app.crud.waste_collection_schedules import get_waste_collection_schedules, create_waste_collection_schedule, update_waste_collection_schedule

router = APIRouter()

@router.get("/waste-collection-schedules", response_model=List[WasteCollectionScheduleResponse])
async def fetch_waste_collection_schedules():
    schedules = get_waste_collection_schedules()
    if schedules is None:
        raise HTTPException(status_code=404, detail="Waste collection schedules not found")
    return schedules

@router.post("/waste-collection-schedules", response_model=int)
async def add_waste_collection_schedule(schedule: WasteCollectionScheduleCreate):
    schedule_id = create_waste_collection_schedule(schedule)
    return schedule_id

@router.put("/waste-collection-schedules/{schedule_id}")
async def update_existing_waste_collection_schedule(schedule_id: int, schedule: WasteCollectionScheduleUpdate):
    existing_schedule = get_waste_collection_schedules()
    if not existing_schedule:
        raise HTTPException(status_code=404, detail="Waste collection schedule not found")
    update_waste_collection_schedule(schedule_id, schedule)
    return {"message": "Waste collection schedule updated successfully"}
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.maintenance_records import MaintenanceRecordCreate, MaintenanceRecordUpdate, MaintenanceRecordResponse
from app.crud.maintenance_records import get_maintenance_records, create_maintenance_record, update_maintenance_record

router = APIRouter()

@router.get("/maintenance-records", response_model=List[MaintenanceRecordResponse])
async def fetch_maintenance_records():
    records = get_maintenance_records()
    if records is None:
        raise HTTPException(status_code=404, detail="Maintenance records not found")
    return records

@router.post("/maintenance-records", response_model=int)
async def add_maintenance_record(record: MaintenanceRecordCreate):
    record_id = create_maintenance_record(record)
    return record_id

@router.put("/maintenance-records/{record_id}")
async def update_existing_maintenance_record(record_id: int, record: MaintenanceRecordUpdate):
    existing_record = get_maintenance_records()
    if not existing_record:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    update_maintenance_record(record_id, record)
    return {"message": "Maintenance record updated successfully"}
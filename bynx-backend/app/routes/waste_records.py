from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.waste_records import WasteRecordCreate, WasteRecordUpdate, WasteRecordResponse
from app.crud.waste_records import get_waste_records, create_waste_record, update_waste_record

router = APIRouter()

@router.get("/waste-records", response_model=List[WasteRecordResponse])
async def fetch_waste_records():
    records = get_waste_records()
    if records is None:
        raise HTTPException(status_code=404, detail="Waste records not found")
    return records

@router.post("/waste-records", response_model=int)
async def add_waste_record(record: WasteRecordCreate):
    record_id = create_waste_record(record)
    return record_id

@router.put("/waste-records/{record_id}")
async def update_existing_waste_record(record_id: int, record: WasteRecordUpdate):
    existing_record = get_waste_records()
    if not existing_record:
        raise HTTPException(status_code=404, detail="Waste record not found")
    update_waste_record(record_id, record)
    return {"message": "Waste record updated successfully"}
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.maintenance_records import MaintenanceRecordCreate, MaintenanceRecordUpdate, MaintenanceRecordResponse
from app.crud.maintenance_records import get_maintenance_records, create_maintenance_record, update_maintenance_record
from app.auth.auth_handler import get_user_role

router = APIRouter()

@router.get("/maintenance", response_model=List[MaintenanceRecordResponse])
async def fetch_maintenance_records(role: str = Depends(get_user_role)):
    if role not in ['Admin', 'Worker']:
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_maintenance_records()

@router.post("/maintenance", response_model=MaintenanceRecordResponse)
async def add_maintenance_record(record: MaintenanceRecordCreate, role: str = Depends(get_user_role)):
    if role != 'Worker':
        raise HTTPException(status_code=403, detail="Not authorized")
    record_id = create_maintenance_record(record)
    return {
        "maintenance_id": record_id,
        **record.dict(),
        "maintenance_date": None
    }

@router.put("/maintenance/{record_id}")
async def update_maintenance_record(record_id: int, record: MaintenanceRecordUpdate, role: str = Depends(get_user_role)):
    if role != 'Admin':
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        update_maintenance_record(record_id, record)
        return {"message": "Maintenance record updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
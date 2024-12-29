from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.complaints import ComplaintCreate, ComplaintUpdate, ComplaintResponse
from app.crud.complaints import get_complaints, get_complaints_by_user, create_complaint, update_complaint, get_user_address
from app.auth.auth_handler import get_user_role
from datetime import datetime

router = APIRouter()

@router.get("/complaints", response_model=List[ComplaintResponse])
async def fetch_complaints(role: str = Depends(get_user_role)):
    if role not in ['Admin', 'Worker']:
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_complaints()

@router.get("/complaints/user/{user_id}", response_model=List[ComplaintResponse])
async def fetch_complaints_by_user(user_id: int, role: str = Depends(get_user_role)):
    if role not in ['Admin', 'User']:
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_complaints_by_user(user_id)

@router.post("/complaints", response_model=ComplaintResponse)
async def add_complaint(complaint: ComplaintCreate, role: str = Depends(get_user_role)):
    if role not in ['Admin', 'User']:
        raise HTTPException(status_code=403, detail="Not authorized")
    complaint_id = create_complaint(complaint)
    return {
        "complaint_id": complaint_id,
        **complaint.dict(),
        "submitted_at": datetime.now(),
        "resolved_at": None,
        "assigned_to": None,
        "worker_id": None,
        "location_id": None,
        "address": get_user_address(complaint.user_id)
    }

@router.put("/complaints/{complaint_id}")
async def update_existing_complaint(complaint_id: int, complaint: ComplaintUpdate, role: str = Depends(get_user_role)):
    if role not in ['Admin', 'Worker']:
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        update_complaint(complaint_id, complaint)
        return {"message": "Complaint updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
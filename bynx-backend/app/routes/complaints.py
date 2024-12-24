from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.complaints import ComplaintCreate, ComplaintUpdate, ComplaintResponse
from app.crud.complaints import get_complaints, create_complaint, update_complaint, get_complaints_by_user, get_complaints_for_admin

router = APIRouter()

@router.get("/complaints/", response_model=List[ComplaintResponse])
async def fetch_complaints():
    return get_complaints()

@router.get("/complaints/user/{user_id}", response_model=List[ComplaintResponse])
async def fetch_complaints_by_user(user_id: int):
    return get_complaints_by_user(user_id)

@router.get("/complaints/admin", response_model=List[ComplaintResponse])
async def fetch_complaints_for_admin():
    return get_complaints_for_admin()

@router.post("/complaints/", response_model=int)
async def add_complaint(complaint: ComplaintCreate):
    return create_complaint(complaint)

@router.put("/complaints/{complaint_id}")
async def update_complaint(complaint_id: int, complaint: ComplaintUpdate):
    update_complaint(complaint_id, complaint)
    return {"message": "Complaint updated successfully"}
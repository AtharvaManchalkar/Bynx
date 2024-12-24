from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.announcements import AnnouncementCreate, AnnouncementResponse
from app.crud.announcements import get_announcements, create_announcement

router = APIRouter()

@router.get("/announcements", response_model=List[AnnouncementResponse])
async def fetch_announcements():
    return await get_announcements()

@router.post("/announcements", response_model=str)
async def add_announcement(announcement: AnnouncementCreate):
    return await create_announcement(announcement)
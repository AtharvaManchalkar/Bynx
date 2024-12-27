from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.waste_processing_centers import WasteProcessingCenterCreate, WasteProcessingCenterUpdate, WasteProcessingCenterResponse
from app.crud.waste_processing_centers import get_waste_processing_centers, create_waste_processing_center, update_waste_processing_center

router = APIRouter()

@router.get("/waste-processing-centers", response_model=List[WasteProcessingCenterResponse])
async def fetch_waste_processing_centers():
    centers = get_waste_processing_centers()
    if centers is None:
        raise HTTPException(status_code=404, detail="Waste processing centers not found")
    return centers

@router.post("/waste-processing-centers", response_model=int)
async def add_waste_processing_center(center: WasteProcessingCenterCreate):
    center_id = create_waste_processing_center(center)
    return center_id

@router.put("/waste-processing-centers/{center_id}")
async def update_existing_waste_processing_center(center_id: int, center: WasteProcessingCenterUpdate):
    existing_center = get_waste_processing_centers()
    if not existing_center:
        raise HTTPException(status_code=404, detail="Waste processing center not found")
    update_waste_processing_center(center_id, center)
    return {"message": "Waste processing center updated successfully"}
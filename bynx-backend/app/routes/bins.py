from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.bins import BinResponse, BinUpdate
from app.crud.bins import get_all_bins, update_bin
from app.auth.auth_handler import get_user_role

router = APIRouter()

@router.get("/bins", response_model=List[BinResponse])
async def fetch_bins(role: str = Depends(get_user_role)):
    if role not in ['Admin', 'Worker']:
        raise HTTPException(status_code=403, detail="Not authorized")
    bins = get_all_bins()
    return bins

@router.put("/bins/{bin_id}")
async def update_bin_status(
    bin_id: int,
    bin_update: BinUpdate,
    role: str = Depends(get_user_role)
):
    if role not in ['Admin', 'Worker']:
        raise HTTPException(status_code=403, detail="Not authorized")
    success = update_bin(bin_id, bin_update.model_dump(exclude_unset=True))
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update bin")
    return {"message": "Bin updated successfully"}
from fastapi import APIRouter, HTTPException
from app.crud.bins import get_bin, update_bin
from app.schemas.bins import BinUpdate

router = APIRouter()

@router.put("/bins/{bin_id}")
async def update_existing_bin(bin_id: int, bin_update: BinUpdate):
    try:
        existing_bin = get_bin(bin_id)
        if not existing_bin:
            raise HTTPException(status_code=404, detail="Bin not found")
        updated_bin = update_bin(bin_id, bin_update.dict())
        return {"message": "Bin updated successfully", "data": updated_bin}
    except Exception as err:
        print(f"Error updating bin: {err}")
        raise HTTPException(status_code=500, detail=str(err))
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.database.mysql import get_mysql_connection
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

@router.get("/collection")
async def fetch_collection_data(role: str = Depends(get_user_role)):
    if role not in ['Admin', 'Worker']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    connection = None
    cursor = None
    try:
        connection = get_mysql_connection()
        if not connection:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = connection.cursor(dictionary=True)
        
        # Get bins with locations and status
        bins_query = """
        SELECT 
            wb.bin_id,
            wb.current_level,
            wb.type,
            wb.last_emptied,
            wb.vehicle_id,
            l.latitude,
            l.longitude,
            l.address
        FROM WasteBin wb 
        JOIN Location l ON wb.location_id = l.location_id
        """
        
        # Get available vehicles with locations
        vehicles_query = """
        SELECT 
            v.vehicle_id,
            v.vehicle_number,
            v.capacity,
            v.last_maintenance,
            v.assigned_worker_id,
            l.latitude,
            l.longitude,
            l.address
        FROM Vehicle v
        JOIN Location l ON v.location_id = l.location_id
        WHERE v.assigned_worker_id IS NOT NULL
        """
        
        cursor.execute(bins_query)
        bins = cursor.fetchall()
        
        cursor.execute(vehicles_query)
        vehicles = cursor.fetchall()
        
        return {
            "bins": bins,
            "vehicles": vehicles
        }
        
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()



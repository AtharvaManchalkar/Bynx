from fastapi import APIRouter, HTTPException
from app.database.mysql import get_mysql_connection
import mysql.connector

router = APIRouter()

@router.get("/summary-metrics")
async def fetch_summary_metrics():
    try:
        connection = get_mysql_connection()
        if connection is None:
            raise HTTPException(status_code=500, detail="Failed to connect to the database")
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT COUNT(*) as totalBins FROM WasteBin")
        totalBins = cursor.fetchone()['totalBins']
        cursor.execute("SELECT COUNT(*) as filledBins FROM WasteBin WHERE current_level > 75")
        filledBins = cursor.fetchone()['filledBins']
        cursor.execute("SELECT COUNT(*) as pendingComplaints FROM Complaint WHERE status = 'Pending'")
        pendingComplaints = cursor.fetchone()['pendingComplaints']
        cursor.execute("SELECT COUNT(*) as scheduledCollections FROM WasteCollectionSchedule WHERE status = 'Scheduled'")
        scheduledCollections = cursor.fetchone()['scheduledCollections']
        cursor.execute("SELECT COUNT(*) as availableVehicles FROM Vehicle WHERE assigned_worker_id IS NULL")
        availableVehicles = cursor.fetchone()['availableVehicles']
        connection.close()
        return {
            "totalBins": totalBins,
            "filledBins": filledBins,
            "pendingComplaints": pendingComplaints,
            "scheduledCollections": scheduledCollections,
            "availableVehicles": availableVehicles
        }
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))
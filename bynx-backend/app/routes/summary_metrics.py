from fastapi import APIRouter, HTTPException
from app.database.mysql import get_mysql_connection
import mysql.connector

router = APIRouter()

@router.get("/summary-metrics")
async def fetch_summary_metrics():
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)

        # Fetch total bins
        cursor.execute("SELECT COUNT(*) AS totalBins FROM Bins")
        total_bins = cursor.fetchone()['totalBins']

        # Fetch filled bins
        cursor.execute("SELECT COUNT(*) AS filledBins FROM Bins WHERE status = 'Full'")
        filled_bins = cursor.fetchone()['filledBins']

        # Fetch pending complaints
        cursor.execute("SELECT COUNT(*) AS pendingComplaints FROM Complaints WHERE status = 'Pending'")
        pending_complaints = cursor.fetchone()['pendingComplaints']

        # Fetch scheduled collections
        cursor.execute("SELECT COUNT(*) AS scheduledCollections FROM CollectionSchedules WHERE status = 'Scheduled'")
        scheduled_collections = cursor.fetchone()['scheduledCollections']

        # Fetch available vehicles
        cursor.execute("SELECT COUNT(*) AS availableVehicles FROM Vehicles WHERE status = 'Available'")
        available_vehicles = cursor.fetchone()['availableVehicles']

        connection.close()

        metrics = {
            "totalBins": total_bins,
            "filledBins": filled_bins,
            "pendingComplaints": pending_complaints,
            "scheduledCollections": scheduled_collections,
            "availableVehicles": available_vehicles,
        }

        return {"data": metrics}
    except mysql.connector.Error as err:
        print(f"Error fetching summary metrics: {err}")
        raise HTTPException(status_code=500, detail=str(err))
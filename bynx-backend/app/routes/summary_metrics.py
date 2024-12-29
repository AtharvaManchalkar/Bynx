from fastapi import APIRouter, HTTPException, Response
from app.database.mysql import get_mysql_connection
import mysql.connector

router = APIRouter()

@router.get("/summary")
async def fetch_summary_metrics(response: Response):
    connection = None
    cursor = None
    try:
        connection = get_mysql_connection()
        if connection is None:
            raise HTTPException(status_code=500, detail="Failed to connect to the database")
        
        cursor = connection.cursor(dictionary=True)
        
        # Execute queries
        queries = {
            "totalBins": "SELECT COUNT(*) as totalBins FROM WasteBin",
            "filledBins": "SELECT COUNT(*) as filledBins FROM WasteBin WHERE current_level > 75",
            "pendingComplaints": "SELECT COUNT(*) as pendingComplaints FROM Complaint WHERE status = 'Pending'",
            "scheduledCollections": "SELECT COUNT(*) as scheduledCollections FROM WasteCollectionSchedule WHERE status = 'Scheduled'",
            "availableVehicles": "SELECT COUNT(*) as availableVehicles FROM Vehicle WHERE assigned_worker_id IS NULL"
        }
        
        results = {}
        for key, query in queries.items():
            cursor.execute(query)
            result = cursor.fetchone()
            results[key] = result[key] if result else 0

        return results
    
    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            try:
                connection.close()
            except Exception as e:
                print(f"Error closing connection: {e}")
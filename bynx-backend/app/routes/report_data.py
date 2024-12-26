from fastapi import APIRouter, HTTPException, Query
from app.database.mysql import get_mysql_connection
import mysql.connector

router = APIRouter()

@router.get("/report-data")
async def fetch_report_data(start_date: str = Query(None), end_date: str = Query(None)):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)

        # Fetch total waste collected over time
        query = """
            SELECT DATE(last_collected) as date, SUM(current_level) as total_waste
            FROM Bins
        """
        params = []
        if start_date and end_date:
            query += " WHERE DATE(last_collected) BETWEEN %s AND %s"
            params.extend([start_date, end_date])
        query += " GROUP BY DATE(last_collected) ORDER BY DATE(last_collected)"
        cursor.execute(query, params)
        waste_data = cursor.fetchall()

        # Fetch bin level trends
        cursor.execute("""
            SELECT Locations.name as location, Bins.current_level
            FROM Bins
            JOIN Locations ON Bins.location_id = Locations.id
        """)
        bin_data = cursor.fetchall()

        connection.close()

        return {"waste_data": waste_data, "bin_data": bin_data}
    except mysql.connector.Error as err:
        print(f"Error fetching report data: {err}")
        raise HTTPException(status_code=500, detail=str(err))
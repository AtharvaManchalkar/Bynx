from fastapi import APIRouter, HTTPException
from app.database.mysql import get_mysql_connection
import mysql.connector

router = APIRouter()

@router.get("/maintenance-requests")
async def fetch_maintenance_requests():
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM MaintenanceRequests"
        cursor.execute(query)
        maintenance_requests = cursor.fetchall()
        connection.close()
        return {"data": maintenance_requests}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))

@router.post("/maintenance-requests")
async def add_maintenance_request(request: dict):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        query = "INSERT INTO MaintenanceRequests (bin_id, description, status, created_at) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (request['bin_id'], request['description'], request['status'], request['created_at']))
        connection.commit()
        request_id = cursor.lastrowid
        connection.close()
        request['request_id'] = request_id
        return {"data": request}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@router.put("/maintenance-requests/{request_id}")
async def update_maintenance_request(request_id: int, request: dict):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        query = "UPDATE MaintenanceRequests SET status = %s, completed_at = %s WHERE request_id = %s"
        cursor.execute(query, (request['status'], request['completed_at'], request_id))
        connection.commit()
        connection.close()
        return {"message": "Maintenance request updated successfully"}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))
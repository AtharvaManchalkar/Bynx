from fastapi import APIRouter, HTTPException
from app.database.mysql import get_mysql_connection
import mysql.connector

router = APIRouter()

@router.get("/complaints")
async def fetch_complaints():
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Complaints"
        cursor.execute(query)
        complaints = cursor.fetchall()
        connection.close()
        return {"data": complaints}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))

@router.post("/complaints")
async def add_complaint(complaint: dict):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        query = "INSERT INTO Complaints (user_id, location, description, status, created_at) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (complaint['user_id'], complaint['location'], complaint['description'], complaint['status'], complaint['created_at']))
        connection.commit()
        complaint_id = cursor.lastrowid
        connection.close()
        complaint['complaint_id'] = complaint_id
        return {"data": complaint}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@router.put("/complaints/{complaint_id}")
async def update_complaint(complaint_id: int, complaint: dict):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        query = "UPDATE Complaints SET status = %s, resolved_at = %s, assigned_to = %s WHERE complaint_id = %s"
        cursor.execute(query, (complaint.get('status'), complaint.get('resolved_at'), complaint.get('assigned_to'), complaint_id))
        connection.commit()
        connection.close()
        return {"message": "Complaint updated successfully"}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))
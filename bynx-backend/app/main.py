from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database.mysql import get_mysql_connection
from app.database.mongodb import get_mongo_connection
from app.routes import bins
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv
import os
import subprocess

# Load environment variables from .env file
load_dotenv()

# Initialize the database with initial data
subprocess.run(["python", "init_db.py"])

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/complaints")
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

@app.post("/complaints")
async def add_complaint(complaint: dict):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        query = "INSERT INTO Complaints (user_id, bin_id, description, status, created_at) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (complaint['user_id'], complaint['bin_id'], complaint['description'], complaint['status'], complaint['created_at']))
        connection.commit()
        complaint_id = cursor.lastrowid
        connection.close()
        complaint['complaint_id'] = complaint_id
        return {"data": complaint}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@app.put("/complaints/{complaint_id}")
async def update_complaint(complaint_id: int, complaint: dict):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        query = "UPDATE Complaints SET status = %s, resolved_at = %s WHERE complaint_id = %s"
        cursor.execute(query, (complaint['status'], complaint['resolved_at'], complaint_id))
        connection.commit()
        connection.close()
        return {"message": "Complaint updated successfully"}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@app.get("/maintenance-requests")
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

@app.post("/maintenance-requests")
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

@app.put("/maintenance-requests/{request_id}")
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

@app.get("/bins")
async def fetch_bins():
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Bins"
        cursor.execute(query)
        bins = cursor.fetchall()
        for bin in bins:
            bin['last_collected'] = bin['last_collected'].strftime('%Y-%m-%d %H:%M:%S') if bin['last_collected'] else None
        connection.close()
        return {"data": bins}
    except mysql.connector.Error as err:
        print(f"Error fetching bins: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@app.get("/mongo-bins")
async def fetch_mongo_bins():
    try:
        db = await get_mongo_connection()
        bins_collection = db["bins"]
        bins = await bins_collection.find().to_list(length=100)
        return {"data": bins}
    except Exception as err:
        print(f"Error fetching mongo bins: {err}")
        raise HTTPException(status_code=500, detail=str(err))

# Include the bins router
app.include_router(bins.router)
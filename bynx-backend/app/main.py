from fastapi import FastAPI, HTTPException, APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
from app.database.mysql import get_mysql_connection
from app.routes import bins, tasks, complaints, users, announcements
from app.crud.bins import get_bin, update_bin, get_all_bins
from app.schemas.bins import BinResponse, BinUpdate
from typing import List
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv
import os
import subprocess
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Initialize the database with initial data
subprocess.run(["python", "init_db.py"])

app = FastAPI()
router = APIRouter()
# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str

class Login(BaseModel):
    email: str
    password: str

@app.post("/register")
def register(user: User):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        cursor.execute("""
            INSERT INTO Users (name, email, password, role, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """, (user.name, user.email, user.password, user.role, datetime.now()))
        connection.commit()
        connection.close()
        return {"success": True, "message": "User registered successfully"}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@app.post("/login")
def login(login: Login):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE email = %s", (login.email,))
        user = cursor.fetchone()
        connection.close()
        if not user or user['password'] != login.password:
            raise HTTPException(status_code=400, detail="Invalid email or password")
        return {"success": True, "role": user['role']}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@app.get("/summary-metrics")
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

@app.put("/complaints/{complaint_id}")
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

@app.get("/bins", response_model=List[BinResponse])
async def fetch_all_bins():
    try:
        bins = get_all_bins()
        return bins
    except Exception as err:
        print(f"Error fetching bins: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@app.get("/report-data")
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
            SELECT location, current_level
            FROM Bins
        """)
        bin_data = cursor.fetchall()

        connection.close()

        return {"waste_data": waste_data, "bin_data": bin_data}
    except mysql.connector.Error as err:
        print(f"Error fetching report data: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    
# Include the bins router
app.include_router(bins.router)

# Include the tasks router
app.include_router(tasks.router)

# Include the complaints router
app.include_router(complaints.router)

# Include the users router
app.include_router(users.router)
app.include_router(announcements.router)
from app.database.mysql import get_mysql_connection
from app.schemas.complaints import ComplaintCreate, ComplaintUpdate
from datetime import datetime
from typing import List, Optional

def get_complaints():
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.*, l.address 
        FROM Complaint c 
        LEFT JOIN Location l ON c.location_id = l.location_id
    """)
    complaints = cursor.fetchall()
    connection.close()
    return complaints

def get_complaints_by_user(user_id: int):
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.*, l.address 
        FROM Complaint c 
        LEFT JOIN Location l ON c.location_id = l.location_id 
        WHERE c.user_id = %s
    """, (user_id,))
    complaints = cursor.fetchall()
    connection.close()
    return complaints

def create_complaint(complaint: ComplaintCreate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    
    # Get user's location_id
    cursor.execute("SELECT location_id FROM Users WHERE user_id = %s", (complaint.user_id,))
    user_location = cursor.fetchone()
    location_id = user_location[0] if user_location else None
    
    cursor.execute("""
        INSERT INTO Complaint (user_id, location_id, description, status, submitted_at)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        complaint.user_id,
        location_id,
        complaint.description,
        complaint.status,
        datetime.now()
    ))
    
    complaint_id = cursor.lastrowid
    connection.commit()
    connection.close()
    return complaint_id

def update_complaint(complaint_id: int, complaint: ComplaintUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    
    if complaint.assigned_to:
        # Get worker_id from Users table
        cursor.execute("""
            SELECT user_id 
            FROM Users 
            WHERE name = %s AND role = 'Worker'
        """, (complaint.assigned_to,))
        worker = cursor.fetchone()
        if worker:
            complaint.worker_id = worker[0]
    
    update_query = "UPDATE Complaint SET "
    params = []

    if complaint.status is not None:
        update_query += "status = %s, "
        params.append(complaint.status)
    if complaint.assigned_to is not None:
        update_query += "assigned_to = %s, "
        params.append(complaint.assigned_to)
    if complaint.worker_id is not None:
        update_query += "worker_id = %s, "
        params.append(complaint.worker_id)
    if complaint.resolved_at is not None:
        update_query += "resolved_at = %s, "
        params.append(complaint.resolved_at)

    update_query = update_query.rstrip(", ")
    update_query += " WHERE complaint_id = %s"
    params.append(complaint_id)

    cursor.execute(update_query, tuple(params))
    connection.commit()
    connection.close()

def get_user_address(user_id: int) -> str:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT l.address 
        FROM Users u
        JOIN Location l ON u.location_id = l.location_id
        WHERE u.user_id = %s
    """, (user_id,))
    result = cursor.fetchone()
    connection.close()
    return result['address'] if result else ''
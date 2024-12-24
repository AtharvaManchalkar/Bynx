from app.database.mysql import get_mysql_connection
from app.schemas.complaints import ComplaintCreate, ComplaintUpdate, ComplaintResponse
from typing import List

def get_complaints() -> List[ComplaintResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Complaints")
    complaints = cursor.fetchall()
    connection.close()
    return complaints

def get_complaints_by_user(user_id: int) -> List[ComplaintResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Complaints WHERE user_id = %s", (user_id,))
    complaints = cursor.fetchall()
    connection.close()
    return complaints

def get_complaints_for_admin() -> List[ComplaintResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Complaints WHERE status = 'Pending'")
    complaints = cursor.fetchall()
    connection.close()
    return complaints

def create_complaint(complaint: ComplaintCreate) -> int:
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO Complaints (user_id, location, description, status, created_at)
        VALUES (%s, %s, %s, %s, %s)
    """, (complaint.user_id, complaint.location, complaint.description, complaint.status, complaint.created_at))
    connection.commit()
    complaint_id = cursor.lastrowid
    connection.close()
    return complaint_id

def update_complaint(complaint_id: int, complaint: ComplaintUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE Complaints
        SET status = %s, resolved_at = %s
        WHERE complaint_id = %s
    """, (complaint.status, complaint.resolved_at, complaint_id))
    connection.commit()
    connection.close()
from typing import List, Optional
from app.database.mysql import get_mysql_connection
from app.schemas.maintenance_records import MaintenanceRecordCreate, MaintenanceRecordUpdate

def get_maintenance_records() -> List[dict]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT m.*, v.vehicle_number 
        FROM MaintenanceRecord m 
        LEFT JOIN Vehicle v ON m.vehicle_id = v.vehicle_id
    """)
    records = cursor.fetchall()
    connection.close()
    return records

def create_maintenance_record(record: MaintenanceRecordCreate) -> dict:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("""
        INSERT INTO MaintenanceRecord (details, cost, vehicle_id, status)
        VALUES (%s, %s, %s, %s)
    """, (record.details, record.cost, record.vehicle_id, record.status))
    
    record_id = cursor.lastrowid
    connection.commit()
    
    # Fetch the created record
    cursor.execute("""
        SELECT m.*, v.vehicle_number 
        FROM MaintenanceRecord m 
        LEFT JOIN Vehicle v ON m.vehicle_id = v.vehicle_id 
        WHERE m.maintenance_id = %s
    """, (record_id,))
    new_record = cursor.fetchone()
    
    connection.close()
    return new_record

def update_maintenance_record(record_id: int, record: MaintenanceRecordUpdate) -> dict:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("""
        UPDATE MaintenanceRecord 
        SET status = %s, maintenance_date = %s
        WHERE maintenance_id = %s
    """, (record.status, record.maintenance_date, record_id))
    
    connection.commit()
    
    # Fetch updated record
    cursor.execute("""
        SELECT m.*, v.vehicle_number 
        FROM MaintenanceRecord m 
        LEFT JOIN Vehicle v ON m.vehicle_id = v.vehicle_id 
        WHERE m.maintenance_id = %s
    """, (record_id,))
    updated_record = cursor.fetchone()
    
    connection.close()
    return updated_record
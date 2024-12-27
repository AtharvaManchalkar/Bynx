from app.database.mysql import get_mysql_connection
from app.schemas.maintenance_records import MaintenanceRecordCreate, MaintenanceRecordUpdate, MaintenanceRecordResponse
from typing import List

def get_maintenance_records() -> List[MaintenanceRecordResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT m.*, v.vehicle_number 
        FROM MaintenanceRecord m 
        JOIN Vehicle v ON m.vehicle_id = v.vehicle_id
    """)
    records = cursor.fetchall()
    connection.close()
    return records

def create_maintenance_record(record: MaintenanceRecordCreate) -> int:
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO MaintenanceRecord (details, cost, maintenance_date, vehicle_id)
        VALUES (%s, %s, %s, %s)
    """, (record.details, record.cost, record.maintenance_date, record.vehicle_id))
    connection.commit()
    record_id = cursor.lastrowid
    connection.close()
    return record_id

def update_maintenance_record(record_id: int, record: MaintenanceRecordUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE MaintenanceRecord
        SET details = %s, cost = %s, maintenance_date = %s, vehicle_id = %s
        WHERE maintenance_id = %s
    """, (record.details, record.cost, record.maintenance_date, record.vehicle_id, record_id))
    connection.commit()
    connection.close()
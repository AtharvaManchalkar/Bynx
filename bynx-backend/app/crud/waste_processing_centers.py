from app.database.mysql import get_mysql_connection
from app.schemas.waste_processing_centers import WasteProcessingCenterCreate, WasteProcessingCenterUpdate, WasteProcessingCenterResponse
from typing import List

def get_waste_processing_centers() -> List[WasteProcessingCenterResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM WasteProcessingCenter")
    centers = cursor.fetchall()
    connection.close()
    return centers

def create_waste_processing_center(center: WasteProcessingCenterCreate) -> int:
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO WasteProcessingCenter (address, processing_type, capacity, contact_no)
        VALUES (%s, %s, %s, %s)
    """, (center.address, center.processing_type, center.capacity, center.contact_no))
    connection.commit()
    center_id = cursor.lastrowid
    connection.close()
    return center_id

def update_waste_processing_center(center_id: int, center: WasteProcessingCenterUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE WasteProcessingCenter
        SET address = %s, processing_type = %s, capacity = %s, contact_no = %s
        WHERE center_id = %s
    """, (center.address, center.processing_type, center.capacity, center.contact_no, center_id))
    connection.commit()
    connection.close()
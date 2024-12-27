from app.database.mysql import get_mysql_connection
from app.schemas.waste_records import WasteRecordCreate, WasteRecordUpdate, WasteRecordResponse
from typing import List

def get_waste_records() -> List[WasteRecordResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM WasteRecord")
    records = cursor.fetchall()
    connection.close()
    return records

def create_waste_record(record: WasteRecordCreate) -> int:
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO WasteRecord (weight, date_collected, processing_center_id, bin_id)
        VALUES (%s, %s, %s, %s)
    """, (record.weight, record.date_collected, record.processing_center_id, record.bin_id))
    connection.commit()
    record_id = cursor.lastrowid
    connection.close()
    return record_id

def update_waste_record(record_id: int, record: WasteRecordUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE WasteRecord
        SET weight = %s, date_collected = %s, processing_center_id = %s, bin_id = %s
        WHERE record_id = %s
    """, (record.weight, record.date_collected, record.processing_center_id, record.bin_id, record_id))
    connection.commit()
    connection.close()
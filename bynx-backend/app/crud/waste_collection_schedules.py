from app.database.mysql import get_mysql_connection
from app.schemas.waste_collection_schedules import WasteCollectionScheduleCreate, WasteCollectionScheduleUpdate, WasteCollectionScheduleResponse
from typing import List

def get_waste_collection_schedules() -> List[WasteCollectionScheduleResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM WasteCollectionSchedule")
    schedules = cursor.fetchall()
    connection.close()
    return schedules

def create_waste_collection_schedule(schedule: WasteCollectionScheduleCreate) -> int:
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO WasteCollectionSchedule (collection_date, collected_at, status, worker_id, vehicle_id, bin_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (schedule.collection_date, schedule.collected_at, schedule.status, schedule.worker_id, schedule.vehicle_id, schedule.bin_id))
    connection.commit()
    schedule_id = cursor.lastrowid
    connection.close()
    return schedule_id

def update_waste_collection_schedule(schedule_id: int, schedule: WasteCollectionScheduleUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE WasteCollectionSchedule
        SET collection_date = %s, collected_at = %s, status = %s, worker_id = %s, vehicle_id = %s, bin_id = %s
        WHERE schedule_id = %s
    """, (schedule.collection_date, schedule.collected_at, schedule.status, schedule.worker_id, schedule.vehicle_id, schedule.bin_id, schedule_id))
    connection.commit()
    connection.close()
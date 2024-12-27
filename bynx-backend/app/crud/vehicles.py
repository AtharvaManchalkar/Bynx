from app.database.mysql import get_mysql_connection
from app.schemas.vehicles import VehicleCreate, VehicleUpdate, VehicleResponse
from typing import List

def get_vehicles() -> List[VehicleResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Vehicle")
    vehicles = cursor.fetchall()
    connection.close()
    return vehicles

def create_vehicle(vehicle: VehicleCreate) -> int:
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO Vehicle (vehicle_number, capacity, last_maintenance, assigned_worker_id, location_id)
        VALUES (%s, %s, %s, %s, %s)
    """, (vehicle.vehicle_number, vehicle.capacity, vehicle.last_maintenance, vehicle.assigned_worker_id, vehicle.location_id))
    connection.commit()
    vehicle_id = cursor.lastrowid
    connection.close()
    return vehicle_id

def update_vehicle(vehicle_id: int, vehicle: VehicleUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE Vehicle
        SET vehicle_number = %s, capacity = %s, last_maintenance = %s, assigned_worker_id = %s, location_id = %s
        WHERE vehicle_id = %s
    """, (vehicle.vehicle_number, vehicle.capacity, vehicle.last_maintenance, vehicle.assigned_worker_id, vehicle.location_id, vehicle_id))
    connection.commit()
    connection.close()
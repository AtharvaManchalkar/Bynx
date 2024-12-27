from app.database.mysql import get_mysql_connection
from app.schemas.locations import LocationCreate, LocationUpdate, LocationResponse
from typing import List

def get_locations() -> List[LocationResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Location")
    locations = cursor.fetchall()
    connection.close()
    return locations

def create_location(location: LocationCreate) -> int:
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO Location (latitude, longitude, address)
        VALUES (%s, %s, %s)
    """, (location.latitude, location.longitude, location.address))
    connection.commit()
    location_id = cursor.lastrowid
    connection.close()
    return location_id

def update_location(location_id: int, location: LocationUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE Location
        SET latitude = %s, longitude = %s, address = %s
        WHERE location_id = %s
    """, (location.latitude, location.longitude, location.address, location_id))
    connection.commit()
    connection.close()
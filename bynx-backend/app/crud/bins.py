from app.database.mysql import get_mysql_connection
from datetime import datetime

def get_bin(bin_id: int):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT Bins.*, Locations.name, Locations.latitude, Locations.longitude
        FROM Bins
        JOIN Locations ON Bins.location_id = Locations.id
        WHERE bin_id = %s
        """
        cursor.execute(query, (bin_id,))
        bin = cursor.fetchone()
        connection.close()
        if bin:
            bin['last_collected'] = bin['last_collected'].isoformat() if bin['last_collected'] else None
            bin['location'] = {
                'id': bin['location_id'],
                'name': bin['name'],
                'latitude': bin['latitude'],
                'longitude': bin['longitude']
            }
        return bin
    except Exception as err:
        print(f"Error fetching bin: {err}")
        return None

def get_all_bins():
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT Bins.*, Locations.name, Locations.latitude, Locations.longitude
        FROM Bins
        JOIN Locations ON Bins.location_id = Locations.id
        """
        cursor.execute(query)
        bins = cursor.fetchall()
        connection.close()
        for bin in bins:
            bin['last_collected'] = bin['last_collected'].isoformat() if bin['last_collected'] else None
            bin['location'] = {
                'id': bin['location_id'],
                'name': bin['name'],
                'latitude': bin['latitude'],
                'longitude': bin['longitude']
            }
        return bins
    except Exception as err:
        print(f"Error fetching bins: {err}")
        return []

def update_bin(bin_id: int, bin_update: dict):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        query = """
        UPDATE Bins
        SET location_id = %s, capacity = %s, current_level = %s, status = %s, last_collected = %s
        WHERE bin_id = %s
        """
        cursor.execute(query, (bin_update['location_id'], bin_update['capacity'], bin_update['current_level'], bin_update['status'], bin_update['last_collected'], bin_id))
        connection.commit()
        connection.close()
        return get_bin(bin_id)
    except Exception as err:
        print(f"Error updating bin: {err}")
        return None
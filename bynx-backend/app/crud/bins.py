from app.database.mysql import get_mysql_connection
from datetime import datetime
from typing import List, Optional
from app.schemas.bins import BinUpdate

def get_all_bins() -> List[dict]:
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT wb.*, l.address as location_name
        FROM WasteBin wb
        LEFT JOIN Location l ON wb.location_id = l.location_id
        """
        cursor.execute(query)
        bins = cursor.fetchall()
        connection.close()

        formatted_bins = []
        for bin in bins:
            status = calculate_bin_status(bin['current_level'])
            formatted_bin = {
                'bin_id': bin['bin_id'],
                'current_level': bin['current_level'],
                'type': bin['type'],
                'location': {
                    'id': bin['location_id'],
                    'name': bin['location_name']
                },
                'vehicle_id': bin['vehicle_id'],
                'last_emptied': bin['last_emptied'].isoformat() if bin['last_emptied'] else None,
                'status': status
            }
            formatted_bins.append(formatted_bin)
        return formatted_bins
    except Exception as err:
        print(f"Error fetching bins: {err}")
        return []

def calculate_bin_status(current_level: int) -> str:
    if current_level >= 75:
        return 'Full'
    elif current_level == 0:
        return 'Empty'
    else:
        return 'Partially Full'

def update_bin(bin_id: int, bin_update: dict) -> bool:
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()

        update_query = "UPDATE WasteBin SET "
        params = []
        update_fields = []

        if 'current_level' in bin_update:
            update_fields.append("current_level = %s")
            params.append(bin_update['current_level'])
        if 'type' in bin_update:
            update_fields.append("type = %s")
            params.append(bin_update['type'])
        if 'last_emptied' in bin_update:
            update_fields.append("last_emptied = %s")
            params.append(bin_update['last_emptied'])
        if 'vehicle_id' in bin_update:
            update_fields.append("vehicle_id = %s")
            params.append(bin_update['vehicle_id'])
        if 'location_id' in bin_update:
            update_fields.append("location_id = %s")
            params.append(bin_update['location_id'])

        if not update_fields:
            return False

        update_query += ", ".join(update_fields)
        update_query += " WHERE bin_id = %s"
        params.append(bin_id)

        cursor.execute(update_query, tuple(params))
        connection.commit()
        connection.close()
        return True
    except Exception as err:
        print(f"Error updating bin: {err}")
        return False
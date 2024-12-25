from app.database.mysql import get_mysql_connection

def get_bin(bin_id: int):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Bins WHERE bin_id = %s"
        cursor.execute(query, (bin_id,))
        bin = cursor.fetchone()
        connection.close()
        return bin
    except Exception as err:
        print(f"Error fetching bin: {err}")
        return None

def update_bin(bin_id: int, bin_update: dict):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        query = """
        UPDATE Bins
        SET location = %s, capacity = %s, current_level = %s, status = %s, last_collected = %s
        WHERE bin_id = %s
        """
        cursor.execute(query, (bin_update['location'], bin_update['capacity'], bin_update['current_level'], bin_update['status'], bin_update['last_collected'], bin_id))
        connection.commit()
        connection.close()
        return get_bin(bin_id)
    except Exception as err:
        print(f"Error updating bin: {err}")
        return None

def get_all_bins():
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Bins"
        cursor.execute(query)
        bins = cursor.fetchall()
        connection.close()
        return bins
    except Exception as err:
        print(f"Error fetching bins: {err}")
        return []
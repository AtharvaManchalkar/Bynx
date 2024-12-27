from app.database.mysql import get_mysql_connection
from app.schemas.alerts import AlertCreate, AlertUpdate, AlertResponse
from typing import List

def get_alerts() -> List[AlertResponse]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Alert")
    alerts = cursor.fetchall()
    connection.close()
    return alerts

def create_alert(alert: AlertCreate) -> int:
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO Alert (type, bin_id)
        VALUES (%s, %s)
    """, (alert.type, alert.bin_id))
    connection.commit()
    alert_id = cursor.lastrowid
    connection.close()
    return alert_id

def update_alert(alert_id: int, alert: AlertUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE Alert
        SET type = %s, bin_id = %s
        WHERE alert_id = %s
    """, (alert.type, alert.bin_id, alert_id))
    connection.commit()
    connection.close()
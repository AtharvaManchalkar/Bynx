from app.database.mysql import get_mysql_connection
from datetime import datetime
from typing import List, Optional

def get_tasks_by_worker(worker_id: int) -> List[dict]:
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            c.complaint_id,
            c.description,
            c.submitted_at,
            c.resolved_at,
            c.status,
            c.location_id,
            l.address
        FROM Complaint c
        LEFT JOIN Location l ON c.location_id = l.location_id
        WHERE c.worker_id = %s
        ORDER BY c.submitted_at DESC
    """, (worker_id,))
    
    tasks = cursor.fetchall()
    connection.close()
    return tasks

def resolve_task(complaint_id: int) -> bool:
    connection = get_mysql_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            UPDATE Complaint 
            SET status = 'Resolved',
                resolved_at = %s
            WHERE complaint_id = %s
        """, (datetime.now(), complaint_id))
        
        connection.commit()
        return True
    except Exception as e:
        print(f"Error resolving task: {e}")
        return False
    finally:
        connection.close()
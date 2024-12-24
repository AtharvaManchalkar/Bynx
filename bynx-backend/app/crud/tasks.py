from app.database.mysql import get_mysql_connection
from app.schemas.tasks import TaskCreate, TaskUpdate

def get_tasks():
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Tasks")
    tasks = cursor.fetchall()
    for task in tasks:
        task['id'] = str(task['id'])  # Convert id to string
    connection.close()
    return tasks

def get_tasks_by_worker(worker_id: int):
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Tasks WHERE worker_id = %s", (worker_id,))
    tasks = cursor.fetchall()
    for task in tasks:
        task['id'] = str(task['id'])  # Convert id to string
    connection.close()
    return tasks

def create_task(task: TaskCreate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO Tasks (description, status, bin_id, worker_id, deadline)
        VALUES (%s, %s, %s, %s, %s)
    """, (task.description, task.status, task.bin_id, task.worker_id, task.deadline))
    connection.commit()
    task_id = cursor.lastrowid
    connection.close()
    return task_id

def update_task(task_id: int, task: TaskUpdate):
    connection = get_mysql_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE Tasks SET status = %s WHERE id = %s", (task.status, task_id))
    connection.commit()
    connection.close()
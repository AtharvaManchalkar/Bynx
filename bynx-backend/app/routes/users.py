from fastapi import APIRouter, HTTPException
from app.database.mysql import get_mysql_connection
from app.schemas.users import UserResponse
from typing import List
import mysql.connector

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
async def get_users(role: str = None):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        if role:
            cursor.execute("SELECT * FROM Users WHERE role = %s", (role,))
        else:
            cursor.execute("SELECT * FROM Users")
        users = cursor.fetchall()
        connection.close()
        return users
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))
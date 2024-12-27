from fastapi import APIRouter, HTTPException
from app.database.mysql import get_mysql_connection
from app.schemas.users import UserCreate, UserResponse
from typing import List
from datetime import datetime
import mysql.connector

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        cursor.execute("""
            INSERT INTO Users (name, email, password, role, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """, (user.name, user.email, user.password, user.role, datetime.now()))
        connection.commit()
        user_id = cursor.lastrowid
        connection.close()
        return UserResponse(id=user_id, **user.dict())
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@router.post("/login")
async def login_user(email: str, password: str):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
        user = cursor.fetchone()
        connection.close()
        if not user or user["password"] != password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"message": "Login successful", "user_id": user["user_id"]}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@router.get("/users", response_model=List[UserResponse])
async def get_users(role: str = None):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        if role:
            cursor.execute("SELECT user_id AS id, name, email, role FROM Users WHERE role = %s", (role,))
        else:
            cursor.execute("SELECT user_id AS id, name, email, role FROM Users")
        users = cursor.fetchall()
        connection.close()
        return users
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database.mysql import get_mysql_connection
from datetime import datetime
import mysql.connector
from app.auth.auth_handler import create_access_token

router = APIRouter()

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str

class Login(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(user: User):
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
        connection.close()
        return {"success": True, "message": "User registered successfully"}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@router.post("/login")
def login(login: Login):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE email = %s", (login.email,))
        user = cursor.fetchone()
        connection.close()
        
        if not user or user['password'] != login.password:
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
        return {
            "success": True,
            "access_token": access_token,
            "role": user['role'],
            "userId": user['user_id']
        }
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))
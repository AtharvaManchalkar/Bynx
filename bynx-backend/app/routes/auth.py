from fastapi import APIRouter, HTTPException
from app.database.mysql import get_mysql_connection
from app.schemas.users import UserCreate, UserLogin, UserResponse
from datetime import datetime
import mysql.connector
from app.auth.auth_handler import create_access_token

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Check existing email
        cursor.execute("SELECT * FROM Users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
            
        # Get default location
        cursor.execute("SELECT location_id FROM Location LIMIT 1")
        location = cursor.fetchone()
        location_id = location['location_id'] if location else 1
        
        # Insert user
        cursor.execute("""
            INSERT INTO Users (name, email, password, role, created_at, location_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user.name, user.email, user.password, user.role, datetime.now(), location_id))
        
        connection.commit()
        user_id = cursor.lastrowid
        
        # Get created user
        cursor.execute("SELECT * FROM Users WHERE user_id = %s", (user_id,))
        new_user = cursor.fetchone()
        connection.close()

        return UserResponse(
            user_id=new_user['user_id'],
            name=new_user['name'],
            email=new_user['email'],
            role=new_user['role'],
            created_at=new_user['created_at'],
            location_id=new_user['location_id']
        )
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail=str(err))

@router.post("/login")
async def login(login_data: UserLogin):
    try:
        connection = get_mysql_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE email = %s", (login_data.email,))
        user = cursor.fetchone()
        connection.close()

        if not user or user['password'] != login_data.password:
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
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database.mysql import get_mysql_connection
from app.schemas.users import UserCreate, UserLogin
from app.crud.users import get_user_by_email, create_user
from app.utils import verify_password

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str

@router.post("/login")
async def login(request: LoginRequest):
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users WHERE email = %s", (request.email,))
    user = cursor.fetchone()
    connection.close()

    if not user or not verify_password(request.password, user['password']):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"success": True, "role": user['role']}

@router.post("/register")
async def register(request: RegisterRequest):
    connection = get_mysql_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users WHERE email = %s", (request.email,))
    user = cursor.fetchone()

    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(request.password)
    cursor.execute("""
        INSERT INTO Users (name, email, password, role, created_at)
        VALUES (%s, %s, %s, %s, NOW())
    """, (request.name, request.email, hashed_password, request.role))
    connection.commit()
    connection.close()

    return {"success": True}
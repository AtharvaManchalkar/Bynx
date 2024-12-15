from fastapi import APIRouter, HTTPException, Depends
from app.database.mongodb import get_collection
from app.schemas.users import UserCreate, UserResponse
from bson import ObjectId
from passlib.hash import bcrypt

router = APIRouter(prefix="/users", tags=["Users"])
users_collection = get_collection("users")

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_data = user.dict()
    user_data["password"] = bcrypt.hash(user.password)  # Hash the password
    result = await users_collection.insert_one(user_data)
    
    return UserResponse(id=str(result.inserted_id), **user.dict())

@router.post("/login")
async def login_user(email: str, password: str):
    user = await users_collection.find_one({"email": email})
    if not user or not bcrypt.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"message": "Login successful", "user_id": str(user["_id"])}

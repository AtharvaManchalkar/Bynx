from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str  # admin, worker, user

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str

from fastapi import Header, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
import jwt
from jwt.exceptions import InvalidTokenError
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Constants
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = "fallback-secret-key-for-development"  # Temporary fallback
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_user_role(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        
        payload = decode_token(token)
        if not (role := payload.get("role")):
            raise HTTPException(status_code=401, detail="No role found in token")
        return role
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

async def get_current_user(token: str = Depends(oauth2_scheme)):
    return decode_token(token)
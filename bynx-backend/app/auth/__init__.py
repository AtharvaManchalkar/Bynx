from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

from .auth_handler import create_access_token, get_user_role, decode_token

__all__ = ['oauth2_scheme', 'create_access_token', 'get_user_role', 'decode_token']
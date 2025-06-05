from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.utils.auth import decode_access_token
from app.crud.user import get_user_by_id
from app.db.database import get_db_session

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

async def get_current_user(token: str = Depends(oauth2_bearer), db = Depends(get_db_session)):
    """
    Retrieve the current user based on the provided JWT token.
    :param token: The JWT token provided by the user.
    :param db: The database session to use for the operation.
    :return: The User object if the token is valid, otherwise raises an HTTPException.
    """
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


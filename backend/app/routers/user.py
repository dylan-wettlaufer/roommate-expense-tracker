from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db_session
from app.db.models import User
from app.schemas.user import UserCreate, UserUpdate, User
from app.db.crud import create_user_in_db as create_user, get_user_by_username
from fastapi.security import OAuth2PasswordRequestForm
from app.utils.auth import create_access_token, verify_password
from app.utils.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db_session)):
    """
    Create a new user in the system.
    This endpoint allows for the creation of a new user with a username, email, and password.
    """
    
    try:
        new_user = await create_user(db, user) # Call the create_user function from crud.py

        return User(
            id=new_user.id,
            username=new_user.username,
            email=new_user.email,
            created_at=new_user.created_at,
            updated_at=new_user.updated_at
        ) # Return the created user object
    
    except ValueError as e: # Handle specific errors like duplicate username or email
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    

@router.post("/login")
async def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db_session)):
    """
    Authenticate a user and return an access token.
    This endpoint allows users to log in with their username and password,
    and returns a JWT access token if the credentials are valid.
    """
    user = await get_user_by_username(db, form_data.username) # Retrieve user by id

    if not user or not verify_password(form_data.password, user.password): # Verify the user's password
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(data={"sub": user.id}) # Create an access token for the user
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def get_current_user(db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Retrieve the current authenticated user.
    This endpoint returns the details of the currently authenticated user.
    """
    return current_user
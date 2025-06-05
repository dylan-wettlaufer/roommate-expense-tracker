from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db_session
from app.db.models import User
from app.schemas.user import UserCreate, UserUpdate, User, UserPasswordChange
from app.crud.user import create_user_in_db as create_user, get_user_by_username, update_password
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
    
    token = create_access_token(data={"sub": str(user.id)}) # Convert UUID to string for JWT payload
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=User)
async def get_current_user(db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Retrieve the current authenticated user.
    This endpoint returns the details of the currently authenticated user.
    """
    return current_user


@router.post("/change-password", response_model=User, status_code=status.HTTP_200_OK)
async def change_password(password_data: UserPasswordChange, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Change the password for the current user.
    This endpoint allows the authenticated user to change their password.
    """
    try:
        updated_user = await update_password(db, current_user, password_data)
        return updated_user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while changing the password"
        )
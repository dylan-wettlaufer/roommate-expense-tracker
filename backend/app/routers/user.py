from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db_session
from app.db.models import User
from app.schemas.user import UserCreate, UserUpdate, User
from app.db.crud import create_user_in_db as create_user

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
    

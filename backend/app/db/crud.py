from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import User, Group, GroupMember
from app.schemas.user import UserCreate
import uuid
from typing import Optional
from sqlalchemy import update
from sqlalchemy.orm import selectinload
from app.utils.auth import hash_password


async def create_user_in_db(db: AsyncSession, user: UserCreate) -> User:
    """
    Create a new user in the database.
    :param db: The database session to use for the operation.
    :param user: The UserCreate schema containing user details.
    :return: The created User object.
    """

    # Check if the username or email already exists
    existing_user = await db.execute(
        select(User).where(
            (User.username == user.username) |
            (User.email == user.email)
        )
    )

    existing_user = existing_user.scalars().first() # Get the first matching user, if any

    if existing_user:
        raise ValueError("Username or email already exists.") # If the user already exists, raise an error
    
    
    # Create a new User instance with hashed password
    new_user = User(
        id=str(uuid.uuid4()),
        username=user.username,
        email=user.email,
        password=hash_password(user.password), 
    )

    # Add the new user to the session and commit
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def get_user_by_username(db: AsyncSession, username: str) -> Optional[User]:
    """
    Retrieve a user by their ID.
    :param db: The database session to use for the operation.
    :param user_id: The ID of the user to retrieve.
    :return: The User object if found, otherwise None.
    """
    result = await db.execute(
        select(User).where(User.username == username)
    )
    user = result.scalars().first() # Get the first matching user, if any

    # If no user is found, scalars() will return None
    if not user:
        return None
    
    return user

async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
    """
    Retrieve a user by their ID.
    :param db: The database session to use for the operation.
    :param user_id: The ID of the user to retrieve.
    :return: The User object if found, otherwise None.
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalars().first()
    # If no user is found, scalars() will return None
    if not user:
        return None
    return user
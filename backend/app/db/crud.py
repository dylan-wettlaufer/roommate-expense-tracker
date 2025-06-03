from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import User, Group, GroupMember
from app.schemas.user import UserCreate
import uuid
from typing import Optional
from sqlalchemy import update
from sqlalchemy.orm import selectinload
from app.utils.authentication import hash_password


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


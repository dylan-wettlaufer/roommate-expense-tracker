from app.db.database import get_db_session
from app.db.models import Group
from app.schemas.group import GroupCreate, GroupUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from fastapi import HTTPException, Depends, Path
from app.utils.dependencies import get_current_user
from app.db.models import User, GroupMember
import secrets
from sqlalchemy import select
import string
from uuid import UUID

def generate_invite_code():
    """Generate a unique 8-character invite code"""
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))

async def create_group_in_db(db: AsyncSession, group: GroupCreate, current_user: User) -> Group:
    """
    Create a new group in the database.
    :param db: The database session to use for the operation.
    :param group: The GroupCreate schema containing group details.
    :param current_user: The current authenticated user.
    :return: The created Group object.
    """
    try:
        invite_code = generate_invite_code() # Generate a unique invite code

        existing_group_check = await db.execute( # Check if the invite code already exists
            select(Group).filter(Group.invite_code == invite_code)
        )

        if existing_group_check.scalar_one_or_none(): # If the invite code already exists, raise an error
            raise ValueError(f"Invite code '{invite_code}' already exists. Please choose another one.")
        
        db_group = Group(  # create the group
            name=group.name,
            description=group.description,
            invite_code=invite_code,
            created_by=current_user.id,
        )

        db.add(db_group)
        await db.commit()
        await db.refresh(db_group)

        group_member = GroupMember(  # create the group member as the admin
            group_id=db_group.id,
            user_id=current_user.id,
            is_admin=True,
        )

        db.add(group_member)
        await db.commit()
        await db.refresh(group_member)

        return db_group

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
    
async def get_group_by_id(db: AsyncSession, group_id: UUID) -> Optional[Group]:
    """
    Retrieve a group by its ID.
    :param db: The database session to use for the operation.
    :param group_id: The ID of the group to retrieve.
    :return: The Group object if found, otherwise None.
    """
    try:
        group = await db.execute(
            select(Group).filter(Group.id == group_id)
        )
        return group.scalar_one_or_none()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


async def update_group_in_db(db: AsyncSession, group_id: UUID, group: GroupUpdate) -> Optional[Group]:
    """
    Update a group in the database.
    :param db: The database session to use for the operation.
    :param group_id: The ID of the group to update.
    :param group: The GroupUpdate schema containing group details.
    :return: The updated Group object if found, otherwise None.
    """
    try:
        # Get the group by ID
        result = await db.execute(
            select(Group).filter(Group.id == group_id)
        )

        db_group = result.scalar_one_or_none()

        if db_group is None:
            raise ValueError(f"Group '{group_id}' not found.")

        db_group.name = group.name
        db_group.description = group.description

        await db.commit()
        await db.refresh(db_group)
        return db_group

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
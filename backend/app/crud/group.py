from app.db.database import get_db_session
from app.db.models import Group
from app.schemas.group import GroupCreate, GroupUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from fastapi import HTTPException, Depends, Path
from app.utils.dependencies import get_current_user
from app.db.models import User
import secrets
from sqlalchemy import select
import string

def generate_invite_code():
    """Generate a unique 8-character invite code"""
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))

async def create_group_in_db(db: AsyncSession, group: GroupCreate, current_user: User) -> Group:
    try:
        invite_code = generate_invite_code()
        existing_group_check = await db.execute(
            select(Group).filter(Group.invite_code == invite_code)
        )
        if existing_group_check.scalar_one_or_none():
            raise ValueError(f"Invite code '{invite_code}' already exists. Please choose another one.")
        
        db_group = Group(
            name=group.name,
            description=group.description,
            invite_code=invite_code,
            created_by=current_user.id,
        )
        db.add(db_group)
        await db.commit()
        await db.refresh(db_group)
        return db_group
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
    


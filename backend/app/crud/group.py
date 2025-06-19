from app.db.database import get_db_session
from app.db.models import Group
from app.schemas.group import GroupCreate, GroupUpdate, InviteCode, GroupOut
from app.schemas.expense import Expense
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from fastapi import HTTPException
from app.utils.dependencies import get_current_user
from app.db.models import User, GroupMember
import secrets
from sqlalchemy import select, func
import string
from uuid import UUID
from app.db.models import Expense
from app.schemas.expense import Expense as ExpenseSchema
from sqlalchemy.orm import selectinload

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
            select(Group)
            .where(Group.id == group_id)
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

async def add_member_to_group_in_db(db: AsyncSession, invite_code: InviteCode, user: User) -> Optional[GroupMember]:
    """
    Add a member to a group in the database.
    :param db: The database session to use for the operation.
    :param group_id: The ID of the group to add the member to.
    :param user: The User object to add to the group.
    :return: The GroupMember object if added successfully, otherwise None.
    """
    try:
        # Get the group by ID
        result = await db.execute(
            select(Group).filter(Group.invite_code == invite_code.invite_code)
        )

        db_group = result.scalar_one_or_none()

        if db_group is None:
            raise ValueError(f"Group '{invite_code.invite_code}' not found.")

        if db_group.invite_code != invite_code.invite_code:
            raise ValueError(f"Invalid invite code '{invite_code.invite_code}'.")
        
        db_group_member = await db.execute( # check if the user is already in the group
            select(GroupMember).filter(GroupMember.group_id == db_group.id, GroupMember.user_id == user.id)
        )

        db_group_member = db_group_member.scalar_one_or_none() # get the group member

        if db_group_member is not None: # if the user is already in the group
            raise ValueError(f"User '{user.id}' is already a member of group '{db_group.id}'.") # raise an error

        db_group_member = GroupMember( # create new group member
            group_id=db_group.id,
            user_id=user.id,
            is_admin=False,
        )

        db.add(db_group_member)
        await db.commit()
        await db.refresh(db_group_member)
        return db_group_member

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

async def get_group_members_in_db(db: AsyncSession, group_id: UUID, current_user: User) -> list[GroupMember]:
    """
    Retrieve all members of a group.
    This endpoint allows the authenticated user to retrieve all members of a group.
    """
    try:
        # check if the user is a member of the group
        is_member_check = await db.execute(
            select(GroupMember).filter(
                GroupMember.group_id == group_id,
                GroupMember.user_id == current_user.id
            )
        )

        # if the user is not a member of the group, raise an error
        if not is_member_check.scalar_one_or_none():
            raise ValueError("User is not a member of this group and cannot view its members.")

        # get all group members
        group_members = await db.execute(
            select(GroupMember).filter(GroupMember.group_id == group_id)
        )

        # return all group members
        return group_members.scalars().all()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
    

async def get_all_groups_in_db(db: AsyncSession, current_user: User) -> list[GroupOut]:
    """
    Retrieve all groups.
    This endpoint allows the authenticated user to retrieve all groups.
    """
    try:
        result = await db.execute(  
            select(Group).join(GroupMember).where(GroupMember.user_id == current_user.id)
        )
        groupList = result.scalars().all() # get all groups the user is a member of

        group_outputs = [] # list to store group outputs
        for group in groupList:
            member_count_result = await db.execute( # get the number of members in the group
                select(func.count(GroupMember.user_id)).where(GroupMember.group_id == group.id)
            )
            member_count = member_count_result.scalar() # get the number of members in the group

            expenses = await db.execute(
                select(Expense).filter(Expense.group_id == group.id)
            )
            expenses = expenses.scalars().all()
            grand_total = 0

            for expense in expenses:
                grand_total += expense.amount
            
            group_outputs.append(GroupOut( # append the group to the list
                id=group.id,
                name=group.name,
                description=group.description,
                member_count=member_count,
                expenses=expenses,
                grand_total=grand_total
            ))

        return group_outputs


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
    
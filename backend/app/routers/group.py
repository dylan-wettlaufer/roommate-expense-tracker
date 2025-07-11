from fastapi import APIRouter
from app.crud.group import create_group_in_db, get_group_by_id, update_group_in_db, get_group_members_in_db
from app.schemas.group import GroupCreate, GroupUpdate, Group, InviteCode, GroupOut
from app.schemas.expense import Expense as ExpenseSchema
from app.utils.dependencies import get_current_user
from app.db.models import User
from fastapi import HTTPException, Depends, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db_session
from uuid import UUID
from app.crud.group import add_member_to_group_in_db, get_all_groups_in_db
from app.schemas.group import GroupMember
from app.db.models import Expense, GroupMember as GroupMemberModel, Group as GroupModel
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.routers.expense import calculate_user_balance

router = APIRouter()


@router.post("/groups/create", response_model=Group, status_code=status.HTTP_201_CREATED)
async def create_group(group: GroupCreate, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Create a new group.
    This endpoint allows the authenticated user to create a new group.
    """
    try:
        new_group = await create_group_in_db(db, group, current_user) # Call the create_group_in_db function from crud.py
        return new_group

    except ValueError as e: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/groups/update/{group_id}", response_model=Group)
async def update_group(group_id: UUID, group: GroupUpdate, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Update a group.
    This endpoint allows the authenticated user to update a group.
    """
    try:
        updated_group = await update_group_in_db(db, group_id, group) # Call the update_group_in_db function from crud.py
        return updated_group
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/groups/single/{group_id}", response_model=GroupOut)
async def get_group(group_id: UUID, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Retrieve a group by its ID.
    This endpoint allows the authenticated user to retrieve a group by its ID.
    """
    try:
        group = await db.get(GroupModel, group_id)
    
        result = await db.execute(
            select(Expense).where(Expense.group_id == group.id)
        )
        expenses = result.scalars().all()

        member_count_result = await db.execute(
            select(func.count(GroupMemberModel.user_id)).where(GroupMemberModel.group_id == group.id)
        )
        member_count = member_count_result.scalar()

        grand_total = sum(exp.amount for exp in expenses)

        balance = await calculate_user_balance(db, group_id, current_user.id)

        return GroupOut(
            id=group.id,
            name=group.name,
            description=group.description,
            member_count=member_count,
            expenses=[ExpenseSchema.model_validate(exp) for exp in expenses],
            grand_total=grand_total,
            balance=balance
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/groups/join", response_model=GroupMember)
async def add_member_to_group(invite_code: InviteCode, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Add a member to a group.
    This endpoint allows the authenticated user to add a member to a group.
    """
    try:
        group_member = await add_member_to_group_in_db(db, invite_code, current_user) # Call the add_member_to_group_in_db function from crud.py
        return group_member
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# get all member from a group
@router.get("/groups/get-members/{group_id}", response_model=list[GroupMember])
async def get_group_members(group_id: UUID, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Retrieve all members of a group.
    This endpoint allows the authenticated user to retrieve all members of a group.
    """
    try:
        group_members = await get_group_members_in_db(db, group_id, current_user) # Call the get_group_members_in_db function from crud.py
        return group_members
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/groups/all", response_model=list[GroupOut])
async def get_all_groups(db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Retrieve all groups.
    This endpoint allows the authenticated user to retrieve all groups.
    """
    try:
        groups = await get_all_groups_in_db(db, current_user) # Call the get_all_groups_in_db function from crud.py
        return groups
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
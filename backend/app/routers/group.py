from fastapi import APIRouter
from app.crud.group import create_group_in_db, get_group_by_id
from app.schemas.group import GroupCreate, GroupUpdate, Group
from app.utils.dependencies import get_current_user
from app.db.models import User
from fastapi import HTTPException, Depends, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db_session
from uuid import UUID

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

@router.get("/groups/{group_id}", response_model=Group)

async def get_group(group_id: UUID, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Retrieve a group by its ID.
    This endpoint allows the authenticated user to retrieve a group by its ID.
    """
    try:
        group = await get_group_by_id(db, group_id) # Call the get_group_by_id function from crud.py
        return group
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

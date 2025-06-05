from fastapi import APIRouter
from app.crud.group import create_group_in_db
from app.schemas.group import GroupCreate, GroupUpdate, Group
from app.utils.dependencies import get_current_user
from app.db.models import User
from fastapi import HTTPException, Depends, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db_session


router = APIRouter()


@router.post("/groups/create", response_model=Group, status_code=status.HTTP_201_CREATED)
async def create_group(group: GroupCreate, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    try:
        new_group = await create_group_in_db(db, group, current_user)
        return new_group
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

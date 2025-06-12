from app.db.database import get_db_session
from app.db.models import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, Expense, ExpenseShare, ExpenseSharesCreate, ExpenseSharesUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from fastapi import HTTPException
from app.utils.dependencies import get_current_user
from app.db.models import User
from uuid import UUID
from sqlalchemy import select
import string
from sqlalchemy import func

async def create_expense_in_db(db: AsyncSession, expense: ExpenseCreate, current_user: User, group_id: UUID) -> Expense:
    """
    Create a new expense in the database.
    :param db: The database session to use for the operation.
    :param expense: The ExpenseCreate schema containing expense details.
    :param current_user: The current authenticated user.
    :return: The created Expense object.
    """
    try:
        new_expense = Expense(
            group_id=group_id,
            name=expense.name,
            amount=expense.amount,
            expense_type=expense.expense_type,
            split_method = expense.split_method,
            settled=expense.settled,
            created_by=current_user.id,
            created_at=func.now(),
            updated_at=func.now()
        )

        db.add(new_expense)
        await db.commit()
        await db.refresh(new_expense)

        return new_expense

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_expense_share_in_db(db: AsyncSession, expense_share: ExpenseSharesCreate, current_user: User, expense_id: UUID) -> ExpenseShares:
    """
    Create a new expense share in the database.
    :param db: The database session to use for the operation.
    :param expense_share: The ExpenseSharesCreate schema containing expense share details.
    :param current_user: The current authenticated user.
    :return: The created ExpenseShares object.
    """
    try:
        new_expense_share = ExpenseShares(
            expense_id=expense_id,
            user_id=current_user.id,
            amount_owed=expense_share.amount_owed,
            amount_paid=expense_share.amount_paid,
            settled=expense_share.settled,
            created_at=func.now(),
            updated_at=func.now()
        )

        db.add(new_expense_share)
        await db.commit()
        await db.refresh(new_expense_share)

        return new_expense_share

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


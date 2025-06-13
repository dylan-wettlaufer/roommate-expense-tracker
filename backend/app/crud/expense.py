from app.db.models import Expense, GroupMember, ExpenseShares
from app.schemas.expense import ExpenseCreate, ExpenseShare, ExpenseSharesCreate
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.db.models import User
from uuid import UUID
from sqlalchemy import select

async def create_expense_in_db(db: AsyncSession, expense: ExpenseCreate, current_user: User, group_id: UUID) -> Expense:
    """
    Create a new expense in the database.
    :param db: The database session to use for the operation.
    :param expense: The ExpenseCreate schema containing expense details.
    :param current_user: The current authenticated user.
    :return: The created Expense object.
    """
    try:

        result = await db.execute(
            select(GroupMember.id).filter(
                GroupMember.group_id == group_id,
                GroupMember.user_id == current_user.id
            )
        )
        group_member = result.scalar_one_or_none()

        if group_member is None:
            raise HTTPException(
                status_code=404,
                detail='User is not a member of this group'
            )

        new_expense = Expense(
            group_id=group_id,
            user_id=current_user.id,
            group_member_id=group_member,
            name=expense.name,
            amount=expense.amount,
            expense_type=expense.expense_type,
            split_method = expense.split_method,
            settled=expense.settled,
        )

        db.add(new_expense)
        await db.commit()
        await db.refresh(new_expense)

        return new_expense

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_expense_share_in_db(db: AsyncSession, expense_share: ExpenseSharesCreate, user_id: UUID, expense_id: UUID) -> ExpenseShare:
    """
    Create a new expense share in the database.
    :param db: The database session to use for the operation.
    :param expense_share: The ExpenseSharesCreate schema containing expense share details.
    :param user_id: The user id of the user who created the expense share.
    :return: The created ExpenseShares object.
    """
    try:
        new_expense_share = ExpenseShares(
            expense_id=expense_id,
            user_id=user_id,
            amount_owed=expense_share.amount_owed,
            amount_paid=expense_share.amount_paid,
            settled=expense_share.settled,
        )

        db.add(new_expense_share)
        await db.commit()
        await db.refresh(new_expense_share)

        return new_expense_share

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


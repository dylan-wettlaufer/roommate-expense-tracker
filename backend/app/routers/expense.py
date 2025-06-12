from fastapi import APIRouter
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, Expense
from app.utils.dependencies import get_current_user
from app.db.models import User
from fastapi import HTTPException, Depends, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db_session
from uuid import UUID
from app.crud.expense import create_expense_in_db, create_expense_share_in_db
from app.schemas.expense import ExpenseSharesCreate
from app.db.models import ExpenseShares
from app.utils.dependencies import get_current_user
from app.db.models import User
from sqlalchemy import func



router = APIRouter()

@router.post("/expenses/create/{group_id}", response_model=Expense, status_code=status.HTTP_201_CREATED)
async def create_expense(expense: ExpenseCreate, group_id: UUID, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Create a new expense.
    This endpoint allows the authenticated user to create a new expense.
    """
    try:
        new_expense = await create_expense_in_db(db, expense, current_user, group_id) # Call the create_expense_in_db function from crud.py
        participants = expense.participants
        splits = expense.splits

        if not participants: # ensures they are participants
            raise HTTPException(status_code=400, detail="No participants provided.")

        shares_to_create = [] # the number of share that swill be ceated


        if expense.split_method == "equal":
            amount_per_person = round(new_expense.amount / len(participants), 2)
            for user_id in participants:
                share = await create_expense_share_in_db(db, ExpenseSharesCreate(amount_owed=amount_per_person, amount_paid=0, settled=False), user_id, new_expense.id)
                shares_to_create.append(share)

        elif expense.split_method == "percent":
            if not splits or len(splits) != len(participants):
                raise HTTPException(status_code=400, detail="Invalid percent splits.")

            for user_id, percent in zip(participants, splits):
                amount_owed = round(new_expense.amount * percent / 100, 2)
                share = await create_expense_share_in_db(db, ExpenseSharesCreate(amount_owed=amount_owed, amount_paid=0, settled=False), user_id, new_expense.id)
                shares_to_create.append(share)

        elif expense.split_method == "custom":
            if not splits or len(splits) != len(participants):
                raise HTTPException(status_code=400, detail="Invalid custom shares.")

            for user_id, amount_owed in zip(participants, splits):
                share = await create_expense_share_in_db(db, ExpenseSharesCreate(amount_owed=amount_owed, amount_paid=0, settled=False), user_id, new_expense.id)
                shares_to_create.append(share)

        else:
            raise HTTPException(status_code=400, detail="Unsupported split method.")

        
        return {"expense": new_expense, "shares": shares_to_create}

    except ValueError as e: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

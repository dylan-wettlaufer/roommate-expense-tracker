from fastapi import APIRouter
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseShare, Expense as ExpenseSchema
from app.utils.dependencies import get_current_user
from app.db.models import User, Expense, Group
from fastapi import HTTPException, Depends, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db_session
from uuid import UUID
from app.crud.expense import create_expense_in_db, create_expense_share_in_db
from app.schemas.expense import ExpenseSharesCreate
from app.db.models import ExpenseShares
from app.utils.dependencies import get_current_user
from app.db.models import User
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload



router = APIRouter()

@router.post("/expenses/create/{group_id}", response_model=ExpenseSchema, status_code=status.HTTP_201_CREATED)
async def create_expense(expense: ExpenseCreate, group_id: UUID, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Create a new expense.
    This endpoint allows the authenticated user to create a new expense.
    """
    try:
        participants = expense.participants
        splits = expense.splits

        if not participants: # ensures there are participants
            raise HTTPException(status_code=400, detail="No participants provided.")

        new_expense = await create_expense_in_db(db, expense, current_user, group_id) # Call the create_expense_in_db function from crud.py
        
        shares_to_create = [] # the number of share that swill be ceated


        if expense.split_method == "equal":
            amount_per_person = round(new_expense.amount / len(participants), 2)
            for user_id in participants:
                # if the current user id is equal to the user_id
                if user_id == current_user.id:
                    share = await create_expense_share_in_db(db, ExpenseSharesCreate(amount_owed=amount_per_person, amount_paid=new_expense.amount, settled=True), user_id, new_expense.id)
                else:
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

        
        return new_expense  

    except ValueError as e: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/get/expense/{expense_id}", response_model=ExpenseSchema, status_code=status.HTTP_200_OK)
async def get_expense(expense_id: UUID, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Retrieve a specific expense by its ID.
    This endpoint allows the authenticated user to retrieve a specific expense by its ID.
    """
    try:
        result = await db.execute(select(Expense).where(Expense.id == expense_id))
        expense = result.scalar_one_or_none()
        return expense
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/get/expense/all/{group_id}", response_model=list[ExpenseResponse], status_code=status.HTTP_200_OK)
async def get_all_expenses(group_id: UUID, db: AsyncSession = Depends(get_db_session), current_user: User = Depends(get_current_user)):
    """
    Retrieve all expenses for a specific group.
    This endpoint allows the authenticated user to retrieve all expenses for a specific group.
    """
    try:
        # get the group
        group_stmt = select(Group).options(selectinload(Group.members)).where(Group.id == group_id)
        group_result = await db.execute(group_stmt)
        group = group_result.scalar_one_or_none()

        if not group:
            return []

        split_count = len(group.members) if group.members else 1 # if the group has no members, the split count is 1

        # get all expenses for the group
        expense_stmt = select(Expense).where(Expense.group_id == group_id)
        expense_result = await db.execute(expense_stmt)
        expenses = expense_result.scalars().all()

        response_data = []

        for expense in expenses:
            amount_per_person = expense.amount / split_count # calculate the amount per person

            # get the user who paid the expense
            paid_by = await db.execute(select(User).where(User.id == expense.user_id))
            paid_by = paid_by.scalar_one_or_none()
            
            response_data.append(ExpenseResponse( # append the expense to the response data
                id=expense.id,
                name=expense.name,
                paid_by=paid_by.first_name + " " + paid_by.last_name,
                split_count=split_count,
                date=expense.created_at,
                amount=expense.amount,
                expense_type=expense.expense_type,
                split_method=expense.split_method,
                amount_per_person=amount_per_person
            ))
        
        return response_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

async def calculate_user_balance(db: AsyncSession, group_id: UUID, user_id: UUID) -> float:
    stmt = (
        select(
            func.coalesce(func.sum(ExpenseShares.amount_paid), 0),
            func.coalesce(func.sum(ExpenseShares.amount_owed), 0),
        )
        .join(ExpenseShares.expense)
        .where(ExpenseShares.user_id == user_id)
        .where(Expense.group_id == group_id)
    )
    result = await db.execute(stmt)
    total_paid, total_owed = result.one()

    balance = round(total_paid - total_owed, 2)
    return balance
from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional

# models for expenses
class ExpenseCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    amount: float = Field(..., gt=0)
    expense_type: str = Field(..., min_length=3, max_length=50)
    split_method: str = Field(..., min_length=3, max_length=50)
    settled: bool = Field(default=False)
    participants: list[UUID] = Field(...)
    splits: Optional[list[float]] = Field(None)

class ExpenseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=50)
    amount: Optional[float] = Field(None, gt=0)
    expense_type: Optional[str] = Field(None, min_length=3, max_length=50)
    split_method: Optional[str] = Field(None, min_length=3, max_length=50)
    settled: Optional[bool] = Field(None)

class Expense(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    group_id: UUID = Field(...)
    name: str = Field(..., min_length=3, max_length=50)
    amount: float = Field(..., gt=0)
    expense_type: str = Field(..., min_length=3, max_length=50)
    split_method: str = Field(..., min_length=3, max_length=50)
    split_count: str = Field(..., min_length=3, max_length=50)
    settled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 

    class Config:
        orm_mode = True

class ExpenseShare(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    expense_id: UUID = Field(...)
    user_id: UUID = Field(...)
    amount_owed: float = Field(..., gt=0)
    amount_paid: float = Field(..., gt=0)
    settled: bool = Field(default=False)
    percent: Optional[float] = Field(None)
    shares: Optional[float] = Field(None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 

    class Config:
        orm_mode = True

class ExpenseSharesCreate(BaseModel):
    amount_owed: float = Field(..., gt=0)
    amount_paid: float = Field(..., gt=0)
    settled: bool = Field(default=False)
    percent: Optional[float] = Field(None)
    shares: Optional[float] = Field(None)

class ExpenseSharesUpdate(BaseModel):
    amount_owed: Optional[float] = Field(None, gt=0)
    amount_paid: Optional[float] = Field(None, gt=0)
    settled: Optional[bool] = Field(None)
    percent: Optional[float] = Field(None)
    shares: Optional[float] = Field(None)
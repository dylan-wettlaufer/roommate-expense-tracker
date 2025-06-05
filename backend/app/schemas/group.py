from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional


class GroupBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=50, description="Name of the group")
    description: Optional[str] = Field(None, max_length=500, description="Optional description of the group")

class Group(GroupBase):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    invite_code: Optional[str] = Field(None, max_length=8)
    created_by: UUID = Field(...)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 

    class Config:
        orm_mode = True

class GroupCreate(GroupBase):
    name: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    

class GroupUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    invite_code: Optional[str] = Field(None, max_length=8)
    created_by: UUID = Field(...)

class GroupDelete(BaseModel):
    id: UUID = Field(...)



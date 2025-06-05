from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional

class Group(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=datetime.now(timezone.utc))

    class Config:
        orm_mode = True

class GroupCreate(Group):
    name: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=500)

class GroupUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=500)

class GroupDelete(BaseModel):
    id: UUID = Field(...)



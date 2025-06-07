from pydantic import BaseModel, Field, EmailStr, conlist
from pydantic import model_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID, uuid4

# Base model for shared user fields
class UserBase(BaseModel):
    email: EmailStr = Field(...)

# For creating a new user
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    confirmPassword: str = Field(..., min_length=8)

    # Pydantic validator to ensure password matches confirm_password
    @model_validator(mode='after')
    def passwords_match(self) -> 'UserCreate':
        if self.password != self.confirmPassword:
            raise ValueError("Passwords do not match.")
        return self

# For updating existing user info
class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None


# Internal full user model
class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    username: str
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True

class UserPasswordChange(BaseModel):
    current_password: str = Field(..., description="The user's current password.")
    new_password: str = Field(..., min_length=8, description="The new password.")
    confirm_new_password: str = Field(..., description="Confirmation of the new password.")

    # Pydantic validator to ensure new_password matches confirm_new_password
    @model_validator(mode='after')
    def passwords_match(self) -> 'UserPasswordChange':
        if self.new_password != self.confirm_new_password:
            raise ValueError("New password and confirmation do not match.")
        return self
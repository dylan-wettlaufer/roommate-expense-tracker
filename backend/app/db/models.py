from sqlalchemy import Column, String, ForeignKey, DateTime, Integer
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
import uuid
import datetime

Base = declarative_base() # Base class for SQLAlchemy models

# Model for the User table
class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


    memberships = relationship('GroupMember', back_populates='user')

# Model for the Group table
class Group(Base):
    __tablename__ = 'groups'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  # <-- add server_default

    members = relationship('GroupMember', back_populates='group')

# Model for the group membership table
class GroupMember(Base):
    __tablename__ = 'group_members'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    group_id = Column(String, ForeignKey('groups.id'), nullable=False)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  # <-- add server_default

    group = relationship('Group', back_populates='members')
    user = relationship('User', back_populates='memberships')

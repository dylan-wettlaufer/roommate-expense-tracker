from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(Integer, default=lambda: int(datetime.datetime.now().timestamp()))
    updated_at = Column(Integer, default=lambda: int(datetime.datetime.now().timestamp()), onupdate=lambda: int(datetime.datetime.now().timestamp()))

class Group(Base):
    __tablename__ = 'groups'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    created_at = Column(Integer, default=lambda: int(datetime.datetime.now().timestamp()))
    updated_at = Column(Integer, default=lambda: int(datetime.datetime.now().timestamp()), onupdate=lambda: int(datetime.datetime.now().timestamp()))
    members = relationship('GroupMember', back_populates='group')

class GroupMember(Base):
    __tablename__ = 'group_members'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    group_id = Column(String, ForeignKey('groups.id'), nullable=False)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    created_at = Column(Integer, default=lambda: int(datetime.datetime.now().timestamp()))
    updated_at = Column(Integer, default=lambda: int(datetime.datetime.now().timestamp()), onupdate=lambda: int(datetime.datetime.now().timestamp()))
    group = relationship('Group', back_populates='members')



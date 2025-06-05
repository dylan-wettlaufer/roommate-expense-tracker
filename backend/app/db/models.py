from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text
import string
import secrets

Base = declarative_base() # Base class for SQLAlchemy models

# Model for the User table
class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=text("gen_random_uuid()"), index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


    memberships = relationship('GroupMember', back_populates='user')
    created_groups = relationship('Group', back_populates='creator')


# Model for the Group table
class Group(Base):
    __tablename__ = 'groups'
    id = Column(UUID(as_uuid=True), primary_key=True, default=text("gen_random_uuid()"), index=True)
    name = Column(String, nullable=False)
    description = Column(String(500), nullable=True)  # NEW FIELD
    invite_code = Column(String(8), unique=True, index=True, nullable=False)  # NEW FIELD
    created_by = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  # <-- add server_default

    members = relationship('GroupMember', back_populates='group')
    creator = relationship('User', back_populates='created_groups')

    @classmethod
    def generate_invite_code(cls):
        """Generate a unique 8-character invite code"""
        return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))


# Model for the group membership table
class GroupMember(Base):
    __tablename__ = 'group_members'
    id = Column(UUID(as_uuid=True), primary_key=True, default=text("gen_random_uuid()"), index=True)
    group_id = Column(UUID(as_uuid=True), ForeignKey('groups.id'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  # <-- add server_default

    group = relationship('Group', back_populates='members')
    user = relationship('User', back_populates='memberships')

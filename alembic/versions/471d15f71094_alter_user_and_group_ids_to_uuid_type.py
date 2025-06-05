"""Alter user and group IDs to UUID type

Revision ID: 471d15f71094
Revises: 51d367f68fe7
Create Date: 2025-06-04 21:14:48.910652

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '471d15f71094'
down_revision: Union[str, None] = '51d367f68fe7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

"""add groups

Revision ID: 7e7ea6ee808a
Revises: 42bf0ae96ca3
Create Date: 2025-06-04 20:44:01.663882

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7e7ea6ee808a'
down_revision: Union[str, None] = '42bf0ae96ca3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

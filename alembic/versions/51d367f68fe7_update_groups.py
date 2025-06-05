"""update groups

Revision ID: 51d367f68fe7
Revises: 7e7ea6ee808a
Create Date: 2025-06-04 21:03:53.998181

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '51d367f68fe7'
down_revision: Union[str, None] = '7e7ea6ee808a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

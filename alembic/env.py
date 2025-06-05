from logging.config import fileConfig
from sqlalchemy.ext.asyncio import AsyncEngine
from alembic import context
import asyncio
import sys
import os
from backend.app.config.settings import settings

# Get the absolute path to the project root
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# Add the 'backend' directory to sys.path so 'app' can be imported
sys.path.insert(0, os.path.join(project_root, 'backend'))

from backend.app.db.models import Base  # Your models
from backend.app.db.database import engine  # Your async SQLAlchemy engine

# Setup logging
config = context.config
fileConfig(config.config_file_name)

target_metadata = Base.metadata


def do_run_migrations(connection):

    url = settings.DATABASE_URL

    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        render_as_batch=True,  # For SQLite
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations():
    async with engine.begin() as conn:
        await conn.run_sync(do_run_migrations)

    await engine.dispose()


def run_migrations_online():
    asyncio.run(run_async_migrations())

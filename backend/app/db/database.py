from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.future import select
from sqlalchemy.schema import CreateTable
from app.config.settings import settings
from app.db.models import Base
from typing import AsyncGenerator

# Create an asynchronous SQLAlchemy engine
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=20,
    max_overflow=0,
    pool_pre_ping=True,  # Validates connections before use
    pool_recycle=3600   # Recycle connections every hour
)

# Create an asynchronous session factory
AsyncSessionLocal = async_sessionmaker(
    autocommit=False, # Don't automatically commit transactions
    autoflush=False,  # Don't automatically flush changes
    bind=engine,      # Bind to our async engine
    expire_on_commit=False, # Keep objects associated with the session after commit
    class_=AsyncSession # Use AsyncSession
)

async def init_db():
    """
    Initialize the database by creating all tables defined in the models.
    This function should be called at application startup.
    """
    async with engine.begin() as conn:
        # Create all tables in the database
        await conn.run_sync(Base.metadata.create_all)
        print("Database tables initialized.")

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get a new database session.
    This function should be used in dependency injection to provide a session
    to route handlers.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            raise e
        finally:
            await session.close()
# This function can be used in FastAPI route handlers to get a database session
# and ensure it is properly closed after use.

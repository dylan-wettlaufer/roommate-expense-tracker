from fastapi import FastAPI, Depends, HTTPException, status
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config.settings import settings
from app.db.database import get_db_session, init_db
from app.db.models import User, Group, GroupMember
from app.routers import user, group, expense
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",  # Your React app
    "http://127.0.0.1:3000",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan event handler to initialize the database at startup.
    This function is called when the application starts and ensures that the
    database is initialized before handling any requests.
    """
    print("Application startup: Initializing database...")
    await init_db() # Call your synchronous init_db() function
    print("Application startup: Database initialized.")

    # You could potentially load AI models here and store them on app.state
    # For example:
    # from models.document_analyzer import DocumentAnalyzer
    # app.state.document_analyzer = DocumentAnalyzer()
    # print("AI models loaded.")

    yield # This is where the application starts serving requests

    # Shutdown event: Clean up resources
    print("Application shutdown: Cleaning up resources...")
    # If you had global resources (like a shared AI model instance)
    # that needed explicit closing or releasing, you'd do it here.
    # For database connections managed by `get_db`, explicit closing isn't usually needed here.
    print("Application shutdown: Resources cleaned.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    description="A FastAPI application for managing roommate expenses and group memberships.",
    lifespan=lifespan,  # Register the lifespan event handler
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for user and group management
app.include_router(user.router, prefix="/api/v1", tags=["users"])
app.include_router(group.router, prefix="/api/v1", tags=["groups"])
app.include_router(expense.router, prefix="/api/v1", tags=["expenses"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}

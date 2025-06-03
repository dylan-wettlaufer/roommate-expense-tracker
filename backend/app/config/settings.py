from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    # this will load environment variables from a .env file
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')
    DATABASE_URL: str 

    PROJECT_NAME: str = "Roomate Expense Tracker"
    API_VERSION: str = "1.0.0"

settings = Settings()
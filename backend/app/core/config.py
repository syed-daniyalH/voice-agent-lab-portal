from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "We Build Trades — Voice Agent Portal API"
    API_V1_STR: str = "/api/v1"
    
    # Database URL: default to PostgreSQL, falls back gracefully to SQLite if PostgreSQL is unavailable locally
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/voice_agent_portal"
    )
    
    # Third-party Integrations
    VOICE_API_KEY: str = os.getenv("VOICE_API_KEY", "")
    GHL_API_KEY: str = os.getenv("GHL_API_KEY", "")
    GHL_LOCATION_ID: str = os.getenv("GHL_LOCATION_ID", "loc_essex_heating_981")
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

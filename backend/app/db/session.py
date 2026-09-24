from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Connect with pool_pre_ping for resilient connections
db_url = settings.DATABASE_URL

try:
    if db_url.startswith("sqlite"):
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(db_url, pool_pre_ping=True)
except Exception as e:
    logger.warning(f"Failed to connect to primary database ({db_url}). Falling back to local SQLite: {e}")
    engine = create_engine("sqlite:///./voice_agent_portal.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

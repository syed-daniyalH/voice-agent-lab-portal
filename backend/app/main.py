from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.session import engine, Base, SessionLocal
from app.models import models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Production REST API for We Build Trades Voice Agent Portal & Voice AI Telephony."
)

# Set CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "docs_url": "/docs",
        "version": "2.0.0"
    }

@app.on_event("startup")
def startup_event():
    # Auto-seed database if empty
    from seed_data import seed_database
    db = SessionLocal()
    try:
        if db.query(models.Call).count() == 0:
            logger.info("Database is empty. Populating initial production trade dataset...")
            seed_database(db)
    except Exception as e:
        logger.error(f"Error during auto-seed: {e}")
    finally:
        db.close()

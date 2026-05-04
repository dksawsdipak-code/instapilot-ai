"""
Main application entry point for InstaPilot AI backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

logger = logging.getLogger(__name__)

# Initialize database tables on startup
def initialize_database():
    """Initialize database tables if they don't exist."""
    try:
        from app.db import Base, engine
        from app.models import CreatorProfile, User, InstagramAccount, Post, Subscription
        
        logger.info("Initializing database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

# Call database initialization
initialize_database()

app = FastAPI(
    title="InstaPilot AI",
    description="AI-powered Instagram content automation",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routes
from app.routes import auth, instagram, posts, billing, profile

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(instagram.router, prefix="/api/instagram", tags=["instagram"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])

@app.get("/")
def read_root():
    return {"message": "Welcome to InstaPilot AI API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

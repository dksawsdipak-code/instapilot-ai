#!/usr/bin/env python
"""
Database Initialization Script for InstaPilot AI
This script initializes all required database tables and can be used for resets.
"""

import sys
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

from app.db import Base, engine, SessionLocal
from app.models import User, InstagramAccount, Post, Subscription
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize database tables."""
    try:
        logger.info("Starting database initialization...")
        
        # Create all tables
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        logger.info("✓ Database tables created successfully!")
        
        # Verify tables exist
        inspector_sql = """
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema='public' AND table_type='BASE TABLE'
        """
        
        db = SessionLocal()
        try:
            from sqlalchemy import text
            result = db.execute(text(inspector_sql))
            tables = [row[0] for row in result]
            
            logger.info(f"\nCreated tables: {', '.join(sorted(tables))}")
            
            expected_tables = {'users', 'instagram_accounts', 'posts', 'subscriptions'}
            missing_tables = expected_tables - set(tables)
            
            if missing_tables:
                logger.warning(f"Warning: Expected tables not found: {missing_tables}")
                return False
            
            logger.info("✓ All required tables are present!")
            return True
            
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"✗ Database initialization failed: {str(e)}")
        return False

def reset_db():
    """Reset database by dropping and recreating tables."""
    try:
        logger.info("Starting database reset...")
        logger.warning("This will DROP all existing tables and recreate them!")
        
        confirmation = input("Type 'yes' to confirm: ").strip().lower()
        if confirmation != 'yes':
            logger.info("Reset cancelled.")
            return False
        
        logger.info("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        logger.info("✓ All tables dropped")
        
        logger.info("Creating new tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✓ All tables created")
        
        logger.info("✓ Database reset successfully!")
        return True
        
    except Exception as e:
        logger.error(f"✗ Database reset failed: {str(e)}")
        return False

def main():
    if len(sys.argv) > 1 and sys.argv[1] == 'reset':
        success = reset_db()
    else:
        success = init_db()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()

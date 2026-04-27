"""
Instagram account management routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db

router = APIRouter()

@router.post("/connect")
def connect_instagram_account(account_data: dict, db: Session = Depends(get_db)):
    """Connect a new Instagram account."""
    # TODO: Implement OAuth flow
    return {"message": "Instagram account connected"}

@router.get("/accounts")
def get_instagram_accounts(db: Session = Depends(get_db)):
    """Get all connected Instagram accounts for the user."""
    return {"accounts": []}

@router.delete("/accounts/{account_id}")
def disconnect_instagram_account(account_id: int, db: Session = Depends(get_db)):
    """Disconnect an Instagram account."""
    return {"message": "Instagram account disconnected"}

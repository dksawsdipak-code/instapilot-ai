"""
Billing and subscription management routes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import SubscriptionResponse

router = APIRouter()

@router.get("/subscription", response_model=SubscriptionResponse)
def get_subscription(db: Session = Depends(get_db)):
    """Get current subscription details."""
    return {"plan": "free", "status": "active"}

@router.post("/upgrade")
def upgrade_subscription(plan: str, db: Session = Depends(get_db)):
    """Upgrade to a paid subscription plan."""
    return {"message": f"Upgraded to {plan} plan"}

@router.post("/cancel")
def cancel_subscription(db: Session = Depends(get_db)):
    """Cancel current subscription."""
    return {"message": "Subscription cancelled"}

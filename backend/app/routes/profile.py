"""Creator profile routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import CreatorProfile, User
from app.routes.auth import get_current_user
from app.schemas import CreatorProfileBase, CreatorProfileResponse

router = APIRouter()


@router.get("/creator", response_model=CreatorProfileResponse | None)
def get_creator_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the signed-in user's creator profile."""
    return db.query(CreatorProfile).filter(CreatorProfile.user_id == current_user.id).first()


@router.put("/creator", response_model=CreatorProfileResponse)
def upsert_creator_profile(
    profile_data: CreatorProfileBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create or update the signed-in user's creator profile."""
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == current_user.id).first()

    if not profile:
        profile = CreatorProfile(user_id=current_user.id)
        db.add(profile)

    profile.niche = profile_data.niche.strip()
    profile.creator_type = profile_data.creator_type.strip()
    profile.target_audience = profile_data.target_audience.strip()
    profile.growth_goal = profile_data.growth_goal.strip()
    profile.brand_tone = profile_data.brand_tone.strip()
    profile.offer = profile_data.offer.strip()
    profile.content_pillars = profile_data.content_pillars.strip()

    db.commit()
    db.refresh(profile)
    return profile

"""Post management routes."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Post, User
from app.routes.auth import get_current_user
from app.schemas import (
    ContentIdeaRequest,
    ContentIdeaResponse,
    PostCreate,
    PostResponse,
    PostSchedule,
    PostUpdate,
)
from app.services.ai import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/create", response_model=PostResponse)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new post draft."""
    if not post.content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post content cannot be empty",
        )

    db_post = Post(
        user_id=current_user.id,
        content=post.content.strip(),
        media_url=post.media_url,
        scheduled_at=post.scheduled_at,
        status="scheduled" if post.scheduled_at else "draft",
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/posts", response_model=list[PostResponse])
def get_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all posts for the user."""
    return (
        db.query(Post)
        .filter(Post.user_id == current_user.id)
        .order_by(Post.created_at.desc())
        .all()
    )

@router.put("/posts/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing draft or scheduled post."""
    if not post_update.content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post content cannot be empty",
        )

    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.status == "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Published posts cannot be edited",
        )

    post.content = post_update.content.strip()
    post.media_url = post_update.media_url
    post.scheduled_at = post_update.scheduled_at
    post.status = "scheduled" if post_update.scheduled_at else "draft"
    db.commit()
    db.refresh(post)
    return post

@router.post("/ideas", response_model=ContentIdeaResponse)
def generate_content_ideas(request: ContentIdeaRequest):
    """Generate creator-specific caption, hooks, hashtags, and pillars."""
    return ai_service.create_creator_ideas(
        niche=request.niche,
        creator_type=request.creator_type,
        target_audience=request.target_audience,
        goal=request.goal,
        tone=request.tone,
        offer=request.offer,
        content_pillars=request.content_pillars,
        count=request.count,
    )

@router.post("/posts/{post_id}/schedule")
def schedule_post(
    post_id: int,
    schedule: PostSchedule,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Schedule a post for publishing."""
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.scheduled_at = schedule.scheduled_at
    post.status = "scheduled"
    db.commit()
    db.refresh(post)
    return post

@router.post("/posts/{post_id}/publish")
def publish_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Publish a post immediately."""
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.status = "published"
    post.published_at = datetime.utcnow()
    db.commit()
    db.refresh(post)
    return post

@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a post."""
    post = db.query(Post).filter(Post.id == post_id, Post.user_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}

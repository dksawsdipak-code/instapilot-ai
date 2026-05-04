"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

# Post Schemas
class PostCreate(BaseModel):
    content: str
    media_url: Optional[str] = None
    scheduled_at: Optional[datetime] = None

class PostResponse(BaseModel):
    id: int
    content: str
    media_url: Optional[str] = None
    status: str
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class PostSchedule(BaseModel):
    scheduled_at: datetime

class ContentIdeaRequest(BaseModel):
    niche: str
    creator_type: str = "creator"
    goal: str = "grow engagement"
    tone: str = "friendly"

class ContentIdeaResponse(BaseModel):
    caption: str
    hooks: List[str]
    hashtags: List[str]
    content_pillars: List[str]

# Subscription Schemas
class SubscriptionResponse(BaseModel):
    plan: str
    status: str
    renewal_date: datetime
    
    class Config:
        from_attributes = True

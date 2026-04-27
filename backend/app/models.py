"""
Database models for InstaPilot AI.
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base
from app.services.auth import hash_password

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    instagram_accounts = relationship("InstagramAccount", back_populates="user")
    posts = relationship("Post", back_populates="user")
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    
    def set_password(self, password: str):
        """Hash and set the password."""
        self.hashed_password = hash_password(password)

class InstagramAccount(Base):
    __tablename__ = "instagram_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    instagram_id = Column(String, unique=True, index=True)
    username = Column(String)
    access_token = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="instagram_accounts")
    posts = relationship("Post", back_populates="account")

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("instagram_accounts.id"))
    content = Column(String)
    media_url = Column(String, nullable=True)
    status = Column(String, default="draft")  # draft, scheduled, published
    scheduled_at = Column(DateTime, nullable=True)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="posts")
    account = relationship("InstagramAccount", back_populates="posts")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    plan = Column(String)  # free, pro, enterprise
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    renewal_date = Column(DateTime)
    
    user = relationship("User", back_populates="subscription")

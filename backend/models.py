from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    steps = relationship("StepsRecord", back_populates="user")
    photos = relationship("Photo", back_populates="user")
    cards = relationship("AchievementCard", back_populates="user")


class StepsRecord(Base):
    __tablename__ = "steps_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(String, index=True)  # YYYY-MM-DD format
    steps = Column(Integer)
    synced_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String)  # "google_health_connect", "manual", etc.

    user = relationship("User", back_populates="steps")


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    latitude = Column(Float)
    longitude = Column(Float)
    image_url = Column(String)  # URL to stored image in cloud storage
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    photo_metadata = Column(Text)  # JSON string with additional metadata

    user = relationship("User", back_populates="photos")


class AchievementCard(Base):
    __tablename__ = "achievement_cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    steps_count = Column(Integer)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=True)
    title = Column(String)
    description = Column(Text)
    generated_at = Column(DateTime, default=datetime.utcnow)
    card_url = Column(String)  # URL to generated card image

    user = relationship("User", back_populates="cards")

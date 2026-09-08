from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Steps Record Schemas
class StepsRecordBase(BaseModel):
    date: str
    steps: int
    source: str = "google_health_connect"


class StepsRecordCreate(StepsRecordBase):
    pass


class StepsRecord(StepsRecordBase):
    id: int
    user_id: int
    synced_at: datetime

    class Config:
        from_attributes = True


# Photo Schemas
class PhotoBase(BaseModel):
    latitude: float
    longitude: float
    image_url: str
    photo_metadata: Optional[str] = None


class PhotoCreate(PhotoBase):
    pass


class Photo(PhotoBase):
    id: int
    user_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True


# Achievement Card Schemas
class AchievementCardBase(BaseModel):
    steps_count: int
    title: str
    description: str
    card_url: str
    photo_id: Optional[int] = None


class AchievementCardCreate(AchievementCardBase):
    pass


class AchievementCard(AchievementCardBase):
    id: int
    user_id: int
    generated_at: datetime

    class Config:
        from_attributes = True

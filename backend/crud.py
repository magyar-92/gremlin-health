from sqlalchemy.orm import Session
from models import User, StepsRecord, Photo, AchievementCard
from schemas import (
    UserCreate, StepsRecordCreate, PhotoCreate, AchievementCardCreate
)


# User CRUD
def create_user(db: Session, user: UserCreate):
    db_user = User(email=user.email, username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


# Steps Record CRUD
def create_steps_record(db: Session, user_id: int, steps: StepsRecordCreate):
    db_steps = StepsRecord(
        user_id=user_id,
        date=steps.date,
        steps=steps.steps,
        source=steps.source
    )
    db.add(db_steps)
    db.commit()
    db.refresh(db_steps)
    return db_steps


def get_steps_by_user_and_date(db: Session, user_id: int, date: str):
    return db.query(StepsRecord).filter(
        StepsRecord.user_id == user_id,
        StepsRecord.date == date
    ).first()


def get_steps_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 30):
    return db.query(StepsRecord).filter(
        StepsRecord.user_id == user_id
    ).offset(skip).limit(limit).all()


def update_steps_record(db: Session, record_id: int, steps: int):
    db_record = db.query(StepsRecord).filter(StepsRecord.id == record_id).first()
    if db_record:
        db_record.steps = steps
        db.commit()
        db.refresh(db_record)
    return db_record


# Photo CRUD
def create_photo(db: Session, user_id: int, photo: PhotoCreate):
    db_photo = Photo(
        user_id=user_id,
        latitude=photo.latitude,
        longitude=photo.longitude,
        image_url=photo.image_url,
        photo_metadata=photo.photo_metadata
    )
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo


def get_photo_by_id(db: Session, photo_id: int):
    return db.query(Photo).filter(Photo.id == photo_id).first()


def get_photos_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 20):
    return db.query(Photo).filter(
        Photo.user_id == user_id
    ).offset(skip).limit(limit).all()


# Achievement Card CRUD
def create_achievement_card(db: Session, user_id: int, card: AchievementCardCreate):
    db_card = AchievementCard(
        user_id=user_id,
        steps_count=card.steps_count,
        title=card.title,
        description=card.description,
        card_url=card.card_url,
        photo_id=card.photo_id
    )
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


def get_card_by_id(db: Session, card_id: int):
    return db.query(AchievementCard).filter(AchievementCard.id == card_id).first()


def get_cards_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 20):
    return db.query(AchievementCard).filter(
        AchievementCard.user_id == user_id
    ).offset(skip).limit(limit).all()

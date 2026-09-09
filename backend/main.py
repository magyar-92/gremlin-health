from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from database import SessionLocal, create_tables, get_db
from models import User, StepsRecord, Photo, AchievementCard
from schemas import (
    UserCreate, User as UserSchema,
    StepsRecordCreate, StepsRecord as StepsRecordSchema,
    PhotoCreate, Photo as PhotoSchema,
    AchievementCardCreate, AchievementCard as AchievementCardSchema
)
import crud

app = FastAPI(title="Gremlin Health API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    try:
        create_tables()
    except Exception as e:
        print(f"Warning: Could not create tables on startup: {e}")


# Health Check
@app.get("/health")
def health_check():
    return {"status": "ok", "version": "0.1.0"}


# Debug endpoint
@app.get("/debug/users")
def debug_users_endpoint(db: Session = Depends(get_db)):
    try:
        users = crud.get_all_users(db, skip=0, limit=100)
        return {"success": True, "count": len(users), "users": users}
    except Exception as e:
        import traceback
        return {"success": False, "error": str(e), "traceback": traceback.format_exc()}


# ============ USER ENDPOINTS ============
@app.post("/api/users", response_model=UserSchema)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    return crud.create_user(db=db, user=user)


@app.get("/api/users/{user_id}", response_model=UserSchema)
def get_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return db_user


@app.get("/api/users", response_model=list[UserSchema])
def list_users_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_users(db, skip=skip, limit=limit)


# ============ STEPS ENDPOINTS ============
@app.post("/api/users/{user_id}/steps", response_model=StepsRecordSchema)
def sync_steps_endpoint(
    user_id: int,
    steps_data: StepsRecordCreate,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if steps for this date already exist
    existing = crud.get_steps_by_user_and_date(db, user_id, steps_data.date)
    if existing:
        # Update existing record
        updated = crud.update_steps_record(db, existing.id, steps_data.steps)
        return updated

    return crud.create_steps_record(db=db, user_id=user_id, steps=steps_data)


@app.get("/api/users/{user_id}/steps", response_model=list[StepsRecordSchema])
def get_steps_history_endpoint(
    user_id: int,
    skip: int = 0,
    limit: int = 30,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return crud.get_steps_by_user(db, user_id=user_id, skip=skip, limit=limit)


@app.get("/api/users/{user_id}/steps/date/{date}", response_model=StepsRecordSchema)
def get_steps_by_date_endpoint(
    user_id: int,
    date: str,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    db_steps = crud.get_steps_by_user_and_date(db, user_id, date)
    if not db_steps:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No steps record for date {date}"
        )

    return db_steps


# ============ PHOTO ENDPOINTS ============
@app.post("/api/users/{user_id}/photos", response_model=PhotoSchema)
def upload_photo_endpoint(
    user_id: int,
    photo_data: PhotoCreate,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return crud.create_photo(db=db, user_id=user_id, photo=photo_data)


@app.get("/api/users/{user_id}/photos", response_model=list[PhotoSchema])
def get_photos_endpoint(
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return crud.get_photos_by_user(db, user_id=user_id, skip=skip, limit=limit)


@app.get("/api/photos/{photo_id}", response_model=PhotoSchema)
def get_photo_endpoint(photo_id: int, db: Session = Depends(get_db)):
    db_photo = crud.get_photo_by_id(db, photo_id=photo_id)
    if not db_photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
    return db_photo


# ============ ACHIEVEMENT CARD ENDPOINTS ============
@app.post("/api/users/{user_id}/cards", response_model=AchievementCardSchema)
def create_card_endpoint(
    user_id: int,
    card_data: AchievementCardCreate,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return crud.create_achievement_card(db=db, user_id=user_id, card=card_data)


@app.get("/api/users/{user_id}/cards", response_model=list[AchievementCardSchema])
def get_cards_endpoint(
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return crud.get_cards_by_user(db, user_id=user_id, skip=skip, limit=limit)


@app.get("/api/cards/{card_id}", response_model=AchievementCardSchema)
def get_card_endpoint(card_id: int, db: Session = Depends(get_db)):
    db_card = crud.get_card_by_id(db, card_id=card_id)
    if not db_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )
    return db_card


# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Gremlin Health API v0.1.0",
        "docs": "/docs",
        "endpoints": {
            "users": "/api/users",
            "steps": "/api/users/{user_id}/steps",
            "photos": "/api/users/{user_id}/photos",
            "cards": "/api/users/{user_id}/cards"
        }
    }

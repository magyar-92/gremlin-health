from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

# Convert standard postgresql:// to postgresql+psycopg:// for psycopg driver
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

# Use in-memory SQLite if DATABASE_URL is not set or has placeholders
if not DATABASE_URL or "[PASSWORD]" in DATABASE_URL or "[HOST]" in DATABASE_URL:
    DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    poolclass=StaticPool,
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


_tables_created = False

def get_db():
    global _tables_created
    if not _tables_created:
        try:
            create_tables()
            _tables_created = True
        except Exception as e:
            print(f"Warning: Could not create tables: {e}")

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    from models import Base
    Base.metadata.create_all(bind=engine)

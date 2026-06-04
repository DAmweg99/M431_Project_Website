from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/food_atelier"
)

# Railway/Heroku liefern teils 'postgres://' — SQLAlchemy 2.x braucht 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# pool_pre_ping: prüft Verbindung vor Nutzung (verhindert "stale connection" Fehler)
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency: gibt eine DB-Session zurück und schliesst sie nach dem Request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

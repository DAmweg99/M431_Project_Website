from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from .database import Base


class Recipe(Base):
    """Datenbank-Modell für ein Rezept."""
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)

    # Grundinfos
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True, index=True)   # z.B. "Pasta", "Suppe", "Dessert"

    # Kochdetails
    servings = Column(Integer, nullable=True)           # Anzahl Portionen
    prep_time = Column(Integer, nullable=True)          # Vorbereitungszeit in Minuten
    cook_time = Column(Integer, nullable=True)          # Kochzeit in Minuten

    # Zutaten & Zubereitung als JSON-Listen
    # Beispiel ingredients: [{"amount": "200g", "name": "Spaghetti"}, ...]
    ingredients = Column(JSON, nullable=False, default=list)
    # Beispiel instructions: ["Wasser kochen", "Pasta hinzufügen", ...]
    instructions = Column(JSON, nullable=False, default=list)

    # Bild
    image_path = Column(String(500), nullable=True)     # Pfad zur gespeicherten Bilddatei

    # Zeitstempel
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

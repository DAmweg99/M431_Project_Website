from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Ingredient(BaseModel):
    """Eine einzelne Zutat."""
    amount: str = Field(example="200g")
    name: str = Field(example="Spaghetti")


# ── Rezept erstellen ────────────────────────────────────────────────────────
class RecipeCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200, example="Spaghetti Carbonara")
    description: Optional[str] = Field(None, example="Ein klassischer italienischer Pasta-Klassiker.")
    category: Optional[str] = Field(None, example="Pasta")
    servings: Optional[int] = Field(None, ge=1, example=4)
    prep_time: Optional[int] = Field(None, ge=0, example=10)   # Minuten
    cook_time: Optional[int] = Field(None, ge=0, example=20)   # Minuten
    ingredients: List[Ingredient] = Field(default=[], example=[{"amount": "200g", "name": "Spaghetti"}])
    instructions: List[str] = Field(default=[], example=["Wasser kochen", "Pasta al dente kochen"])


# ── Rezept aktualisieren (alle Felder optional) ─────────────────────────────
class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    servings: Optional[int] = Field(None, ge=1)
    prep_time: Optional[int] = Field(None, ge=0)
    cook_time: Optional[int] = Field(None, ge=0)
    ingredients: Optional[List[Ingredient]] = None
    instructions: Optional[List[str]] = None


# ── Rezept-Antwort (was die API zurückgibt) ──────────────────────────────────
class RecipeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    servings: Optional[int]
    prep_time: Optional[int]
    cook_time: Optional[int]
    ingredients: List[Ingredient]
    instructions: List[str]
    image_path: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True  # Erlaubt SQLAlchemy-Objekte direkt zu lesen

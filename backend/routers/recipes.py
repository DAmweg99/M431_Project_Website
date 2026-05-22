import shutil
import uuid
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from sqlalchemy import or_, func, cast, Text
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Recipe
from ..schemas import RecipeCreate, RecipeUpdate, RecipeResponse

router = APIRouter(prefix="/recipes", tags=["Rezepte"])

# Ordner für hochgeladene Bilder
UPLOAD_DIR = Path(__file__).parent.parent.parent / "images" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


# ── GET /recipes ─────────────────────────────────────────────────────────────
@router.get("/", response_model=List[RecipeResponse], summary="Alle Rezepte abrufen")
def get_recipes(
    skip: int = Query(0, ge=0, description="Wie viele Rezepte überspringen"),
    limit: int = Query(20, ge=1, le=100, description="Maximale Anzahl Rezepte"),
    category: Optional[str] = Query(None, description="Nach Kategorie filtern"),
    db: Session = Depends(get_db),
):
    query = db.query(Recipe)
    if category:
        query = query.filter(func.lower(Recipe.category) == category.lower())
    return query.order_by(Recipe.created_at.desc()).offset(skip).limit(limit).all()


# ── GET /recipes/search ───────────────────────────────────────────────────────
@router.get("/search", response_model=List[RecipeResponse], summary="Rezepte suchen")
def search_recipes(
    q: str = Query(..., min_length=1, description="Suchbegriff (Titel, Beschreibung, Zutaten)"),
    db: Session = Depends(get_db),
):
    """
    Durchsucht Rezepte nach:
    - Titel
    - Beschreibung
    - Kategorie
    - Zutaten (JSON-Text)
    """
    term = f"%{q.lower()}%"
    results = (
        db.query(Recipe)
        .filter(
            or_(
                func.lower(Recipe.title).like(term),
                func.lower(Recipe.description).like(term),
                func.lower(Recipe.category).like(term),
                func.lower(cast(Recipe.ingredients, Text)).like(term),
            )
        )
        .order_by(Recipe.created_at.desc())
        .limit(50)
        .all()
    )
    return results


# ── GET /recipes/{id} ─────────────────────────────────────────────────────────
@router.get("/{recipe_id}", response_model=RecipeResponse, summary="Einzelnes Rezept abrufen")
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")
    return recipe


# ── POST /recipes ─────────────────────────────────────────────────────────────
@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED, summary="Rezept erstellen")
def create_recipe(data: RecipeCreate, db: Session = Depends(get_db)):
    recipe = Recipe(
        title=data.title,
        description=data.description,
        category=data.category,
        servings=data.servings,
        prep_time=data.prep_time,
        cook_time=data.cook_time,
        ingredients=[i.model_dump() for i in data.ingredients],
        instructions=data.instructions,
    )
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe


# ── PUT /recipes/{id} ────────────────────────────────────────────────────────
@router.put("/{recipe_id}", response_model=RecipeResponse, summary="Rezept aktualisieren")
def update_recipe(recipe_id: int, data: RecipeUpdate, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")

    update_data = data.model_dump(exclude_unset=True)
    if "ingredients" in update_data and update_data["ingredients"] is not None:
        update_data["ingredients"] = [i.model_dump() if hasattr(i, "model_dump") else i for i in data.ingredients]

    for field, value in update_data.items():
        setattr(recipe, field, value)

    db.commit()
    db.refresh(recipe)
    return recipe


# ── DELETE /recipes/{id} ──────────────────────────────────────────────────────
@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Rezept löschen")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")

    # Bild mitlöschen, falls vorhanden
    if recipe.image_path:
        img_file = Path(recipe.image_path)
        if img_file.exists():
            img_file.unlink()

    db.delete(recipe)
    db.commit()


# ── POST /recipes/{id}/image ──────────────────────────────────────────────────
@router.post("/{recipe_id}/image", response_model=RecipeResponse, summary="Bild hochladen")
async def upload_image(
    recipe_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")

    # Dateityp prüfen
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Ungültiger Dateityp: {file.content_type}. Erlaubt: JPEG, PNG, WebP",
        )

    # Altes Bild löschen
    if recipe.image_path:
        old = Path(recipe.image_path)
        if old.exists():
            old.unlink()

    # Eindeutigen Dateinamen generieren
    ext = Path(file.filename).suffix.lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    save_path = UPLOAD_DIR / filename

    with save_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    recipe.image_path = str(save_path)
    db.commit()
    db.refresh(recipe)
    return recipe

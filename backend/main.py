from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import text
from pathlib import Path
import os

from .database import engine, DATABASE_URL
from . import models
from .routers import recipes

# Pfade relativ zu backend/main.py
ROOT = Path(__file__).parent.parent

# Datenbank-Tabellen automatisch erstellen
try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"⚠️  DB nicht erreichbar beim Start: {e}")
    print("   Stelle sicher dass DATABASE_URL korrekt gesetzt ist.")

app = FastAPI(
    title="Food Atelier API",
    description="Backend für die Food Atelier Rezept-Website",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── API Routes ─────────────────────────────────────────────────────────────────
app.include_router(recipes.router, prefix="/api")


# ── Diagnose-Endpunkt: zeigt DB-Status (Passwort wird maskiert) ────────────────
@app.get("/api/health", tags=["Status"])
def health():
    raw = os.getenv("DATABASE_URL")
    # Host aus der URL extrahieren (ohne Passwort zu zeigen)
    safe_url = DATABASE_URL
    if "@" in safe_url:
        prefix, host_part = safe_url.split("@", 1)
        scheme = prefix.split("://", 1)[0]
        safe_url = f"{scheme}://***:***@{host_part}"

    result = {
        "database_url_gesetzt": raw is not None,
        "verwendete_url": safe_url,
        "db_verbindung": "unbekannt",
    }

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            # Anzahl Rezepte zählen
            count = conn.execute(text("SELECT COUNT(*) FROM recipes")).scalar()
            result["db_verbindung"] = "OK"
            result["anzahl_rezepte"] = count
    except Exception as e:
        result["db_verbindung"] = "FEHLER"
        result["fehler"] = str(e)[:300]

    return result

# ── Hochgeladene Bilder ────────────────────────────────────────────────────────
UPLOAD_DIR = ROOT / "images" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# ── Frontend HTML-Seiten ───────────────────────────────────────────────────────
@app.get("/", include_in_schema=False)
def index():
    return FileResponse(str(ROOT / "index.html"))

@app.get("/kategorien", include_in_schema=False)
@app.get("/kategorien.html", include_in_schema=False)
def kategorien():
    return FileResponse(str(ROOT / "kategorien.html"))

@app.get("/recipe", include_in_schema=False)
@app.get("/recipe.html", include_in_schema=False)
def recipe():
    return FileResponse(str(ROOT / "recipe.html"))

@app.get("/admin", include_in_schema=False)
@app.get("/admin.html", include_in_schema=False)
def admin():
    return FileResponse(str(ROOT / "admin.html"))

# ── Statische Assets (CSS, JS, Bilder) ────────────────────────────────────────
app.mount("/css",    StaticFiles(directory=str(ROOT / "css")),    name="css")
app.mount("/js",     StaticFiles(directory=str(ROOT / "js")),     name="js")
app.mount("/images", StaticFiles(directory=str(ROOT / "images")), name="images")

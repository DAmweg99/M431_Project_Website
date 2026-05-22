from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .database import engine
from . import models
from .routers import recipes

# Datenbank-Tabellen automatisch erstellen (beim ersten Start)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Food Atelier API",
    description="Backend für die Food Atelier Rezept-Website",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
# Erlaubt dem Browser (Frontend) Anfragen an die API zu machen
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:5500",    # VS Code Live Server
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Statische Dateien (hochgeladene Bilder) ───────────────────────────────────
UPLOAD_DIR = Path(__file__).parent.parent / "images" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# ── Router einbinden ──────────────────────────────────────────────────────────
app.include_router(recipes.router, prefix="/api")


@app.get("/", tags=["Status"])
def root():
    return {
        "status": "ok",
        "message": "Food Atelier API läuft!",
        "docs": "/docs",
    }

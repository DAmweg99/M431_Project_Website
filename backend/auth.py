import os
import hashlib
from fastapi import Header, HTTPException

# Admin-Passwort kommt aus der Umgebungsvariable (Railway → Variables).
# Lokal Fallback, damit die Entwicklung ohne Setzen der Variable funktioniert.
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "FoodAtelier2026")


def _token_for(password: str) -> str:
    """Leitet aus dem Passwort einen stabilen Token ab (nicht das Passwort selbst)."""
    return hashlib.sha256(f"food-atelier::{password}".encode("utf-8")).hexdigest()


# Gültiger Token für den aktuellen Passwort-Wert
ADMIN_TOKEN = _token_for(ADMIN_PASSWORD)


def verify_password(password: str) -> bool:
    return password == ADMIN_PASSWORD


def require_admin(x_admin_token: str = Header(default="")):
    """
    FastAPI-Dependency: schützt Schreib-Endpunkte.
    Erwartet den Header 'X-Admin-Token' mit dem beim Login erhaltenen Token.
    """
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(
            status_code=401,
            detail="Nicht autorisiert – bitte als Admin anmelden.",
        )
    return True

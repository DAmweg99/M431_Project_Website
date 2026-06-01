import os
from pathlib import Path

# Zentraler Ort für hochgeladene Bilder.
#
# Lokal:   <projekt>/images/uploads  (Standard)
# Railway: auf ein gemountetes Volume zeigen via Umgebungsvariable UPLOAD_DIR
#          z.B. UPLOAD_DIR=/data  → Bilder bleiben über Deployments erhalten
_default = Path(__file__).parent.parent / "images" / "uploads"

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(_default)))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

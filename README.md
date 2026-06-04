# Food Atelier

## Inhaltsverzeichnis

1. [Projektbeschreibung](#1-projektbeschreibung)
2. [Zielsetzung](#2-zielsetzung)
3. [Technologien](#3-technologien)
   1. [Frontend](#31-frontend)
   2. [Backend](#32-backend)
   3. [Datenbank](#33-datenbank)
   4. [Entwicklungsumgebung & Deployment](#34-entwicklungsumgebung--deployment)
4. [Projektmethode](#4-projektmethode)
5. [Sprintplanung](#5-sprintplanung)
6. [Risiken](#6-risiken)
7. [Projektstruktur](#7-projektstruktur)
8. [Installation](#8-installation)
   1. [Repository klonen](#81-repository-klonen)
   2. [Frontend starten](#82-frontend-starten)
   3. [Backend einrichten](#83-backend-einrichten)
   4. [Datenbank einrichten](#84-datenbank-einrichten)
   5. [Backend starten](#85-backend-starten)
9. [API-Endpunkte](#9-api-endpunkte)
10. [Sprint 1](#10-sprint-1)
    1. [Zeitraum](#101-zeitraum)
    2. [Sprintplanung](#102-sprintplanung)
       1. [Sprintziel](#1021-sprintziel)
       2. [Aufgaben](#1022-aufgaben)
       3. [Verwendete Technologien](#1023-verwendete-technologien)
    3. [Sprint Review](#103-sprint-review)
       1. [Durchgeführtes Review](#1031-durchgefuhrtes-review)
       2. [Offene Punkte für das Review](#1032-offene-punkte-fur-das-review)
    4. [Sprint Retrospektive](#104-sprint-retrospektive)
       1. [Sternfisch Modell](#1041-sternfisch-modell)
11. [Sprint 2](#11-sprint-2)
    1. [Zeitraum](#111-zeitraum)
    2. [Sprintplanung](#112-sprintplanung)
       1. [Sprintziel](#1121-sprintziel)
       2. [Aufgaben](#1122-aufgaben)
       3. [Verwendete Technologien](#1123-verwendete-technologien)
    3. [Sprint Review](#113-sprint-review)
       1. [Durchgeführtes Review](#1131-durchgefuhrtes-review)
       2. [Offene Punkte für das Review](#1132-offene-punkte-fur-das-review)
    4. [Sprint Retrospektive](#114-sprint-retrospektive)
       1. [Sternfisch Modell](#1141-sternfisch-modell)

---

# 1 Projektbeschreibung

Food Atelier ist eine moderne Rezept Website, auf welcher eigene Rezepte veröffentlicht werden. Benutzer sollen Rezepte einfach durchsuchen, ansehen und nachkochen können. Die Website ist mit HTML, CSS und JavaScript aufgebaut und wird durch ein Python Backend (FastAPI) sowie eine PostgreSQL Datenbank ergänzt. Das Frontend lädt seine Inhalte dynamisch über eine REST-API.

---

# 2 Zielsetzung

Ziel des Projektes ist die Entwicklung einer modernen und benutzerfreundlichen Rezept Website.

Die Website soll:

- eigene Rezepte übersichtlich darstellen
- ein modernes und ansprechendes Design besitzen
- eine Suchfunktion enthalten
- Rezepte nach Kategorien filtern können
- mit einer SQL Datenbank verbunden sein
- online verfügbar sein

---

# 3 Technologien

## 3.1 Frontend

- HTML
- CSS
- JavaScript (Fetch API für die Anbindung an das Backend)
- Google Fonts (Amatic SC, Poppins)

## 3.2 Backend

- Python
- FastAPI (REST-API)
- Uvicorn (ASGI-Server)
- SQLAlchemy (ORM)
- Pydantic (Datenvalidierung)

## 3.3 Datenbank

- PostgreSQL

## 3.4 Entwicklungsumgebung & Deployment

- Visual Studio Code
- Git
- GitHub
- Railway (Deployment)

---

# 4 Projektmethode

Das Projekt wird mit einem agilen Vorgehen umgesetzt. Die Entwicklung erfolgt schrittweise in mehreren Sprints.

Jeder Sprint beinhaltet:

- Planung der nächsten Funktionen
- Umsetzung der Features
- Testen der Website
- Verbesserung des Designs und der Benutzerfreundlichkeit

Da das Projekt alleine entwickelt wird, erfolgt die Organisation vereinfacht ohne komplexes Scrum Management oder Issue Tracking.

---

# 5 Sprintplanung

| Sprint | Zeitraum | Inhalt |
|---|---|---|
| Sprint 1 | 08.05.2026 - 28.05.2026 | Projektaufbau, GitHub Repository erstellen, HTML Grundstruktur, CSS Grunddesign, Header und Navigation erstellen |
| Sprint 2 | 29.05.2026 - 18.06.2026 | Frontend an API anbinden, Live-Suche, Kategorie-Filter, Rezept-Detailseite, FastAPI Backend, REST-API, PostgreSQL Datenbank |
| Sprint 3 | 19.06.2026 - 03.07.2026 | Kategorie-Filter verbessern, Website optimieren, Fehler beheben, Tests, Deployment finalisieren, Abschluss und Dokumentation |

---

# 6 Risiken

| Risiko | Beschreibung |
|---|---|
| Zeitmanagement | Einzelne Funktionen benötigen mehr Zeit als geplant |
| Neue Technologien | Fehlende Erfahrung mit Backend und Datenbanken |
| Designänderungen | Häufige Anpassungen am Layout verursachen zusätzlichen Aufwand |
| Fehlersuche | Kleine Syntaxfehler können grössere Probleme verursachen |
| Datenbankanbindung | Verbindung zwischen Frontend und Backend kann komplex werden |

---

# 7 Projektstruktur

```text
M431_Project_Website/
│
├── index.html              # Startseite (Hero, Suche, Rezept der Woche)
├── kategorien.html         # Kategorie-Filter und Rezept-Grid
├── recipe.html             # Rezept-Detailansicht
│
├── css/
│   └── style.css           # Gesamtes Design
│
├── js/
│   └── app.js              # Frontend-Logik & API-Anbindung
│
├── images/                 # Bilder (inkl. Uploads)
│
├── backend/
│   ├── main.py             # FastAPI App, CORS, Routen-Einbindung
│   ├── database.py         # Datenbankverbindung (SQLAlchemy)
│   ├── models.py           # Datenbank-Modell (Recipe)
│   ├── schemas.py          # Pydantic-Schemas
│   └── routers/
│       └── recipes.py      # API-Endpunkte für Rezepte
│
├── requirements.txt        # Python-Abhängigkeiten
├── railway.toml            # Deployment-Konfiguration (Railway)
├── .env.example            # Vorlage für Umgebungsvariablen
└── .gitignore
```

---

# 8 Installation

## 8.1 Repository klonen

Das Repository wird zuerst lokal auf den Computer geklont.

```bash
git clone <repository-url>
cd M431_Project_Website
```

## 8.2 Frontend starten

Die Website kann lokal gestartet werden, indem die Datei `index.html` im Browser geöffnet wird.

Alternativ kann das Projekt in Visual Studio Code mit der Live Server Erweiterung gestartet werden (Standard-Adresse: `http://127.0.0.1:5500`).

> Hinweis: Damit Rezepte, Suche und das «Rezept der Woche» angezeigt werden, muss zusätzlich das Backend laufen (siehe 8.3 – 8.5). Ist das Backend nicht erreichbar, zeigt die Website einen statischen Fallback an.

## 8.3 Backend einrichten

Es wird empfohlen, eine virtuelle Umgebung zu verwenden und anschliessend die Abhängigkeiten zu installieren.

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

## 8.4 Datenbank einrichten

Das Projekt verwendet PostgreSQL. Die Zugangsdaten werden über eine `.env` Datei gesetzt.

```bash
# .env.example kopieren und anpassen
cp .env.example .env
```

In der `.env` Datei wird die Verbindung eingetragen:

```text
DATABASE_URL=postgresql://username:password@localhost:5432/food_atelier
```

Die benötigten Tabellen werden beim ersten Start des Backends automatisch erstellt.

## 8.5 Backend starten

```bash
uvicorn backend.main:app --reload
```

Die API ist anschliessend erreichbar unter:

- API-Basis: `http://localhost:8000`
- Interaktive API-Dokumentation (Swagger): `http://localhost:8000/docs`

---

# 9 API-Endpunkte

Alle Rezept-Endpunkte sind unter dem Präfix `/api/recipes` erreichbar.

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| GET | `/api/recipes` | Alle Rezepte abrufen (mit Paginierung & Kategorie-Filter) |
| GET | `/api/recipes/search?q=` | Rezepte nach Titel, Beschreibung, Kategorie oder Zutaten durchsuchen |
| GET | `/api/recipes/{id}` | Einzelnes Rezept abrufen |
| POST | `/api/recipes` | Neues Rezept erstellen |
| PUT | `/api/recipes/{id}` | Rezept aktualisieren |
| DELETE | `/api/recipes/{id}` | Rezept löschen |
| POST | `/api/recipes/{id}/image` | Bild zu einem Rezept hochladen |
| GET | `/` | Status der API prüfen |

---

# 10 Sprint 1

## 10.1 Zeitraum

08.05.2026 - 28.05.2026

---

## 10.2 Sprintplanung

### 10.2.1 Sprintziel

Im ersten Sprint wird die Grundstruktur der Website erstellt. Zusätzlich sollen erste Designideen umgesetzt und die Entwicklungsumgebung vorbereitet werden.

---

### 10.2.2 Aufgaben

| Aufgabe | Status |
|---|---|
| GitHub Repository erstellen | Erledigt |
| Projektstruktur erstellen | Erledigt |
| HTML Grundstruktur erstellen | Erledigt |
| CSS Datei einrichten | Erledigt |
| JavaScript Datei einrichten | Erledigt |
| Header und Navigation erstellen | Erledigt |
| Hero Section mit Suchfeld erstellen | Erledigt |
| Popup Welcome Fenster erstellen | Erledigt |
| Rezept der Woche Bereich erstellen | Erledigt |
| Bilder und Design hinzufügen | Erledigt |
| README Dokumentation erstellen | Erledigt |

---

### 10.2.3 Verwendete Technologien

- HTML
- CSS
- JavaScript
- Git
- GitHub
- Visual Studio Code

---

## 10.3 Sprint Review

### 10.3.1 Durchgeführtes Review

Das Sprint Review Gespräch mit der Lehrperson findet am Ende des ersten Sprints statt.

Dabei werden folgende Punkte präsentiert:

- Aufbau der Website
- Aktuelles Design
- Navigation und Benutzeroberfläche
- Hero Section mit Suchfeld
- Rezept der Woche Bereich
- Verwendung von Git und GitHub
- Projektstruktur und Dokumentation

---

### 10.3.2 Offene Punkte für das Review

- Feedback zum aktuellen Design einholen
- Verbesserungsvorschläge besprechen
- Weitere Funktionen für Sprint 2 definieren
- Planung der Backend Entwicklung vorbereiten

---

## 10.4 Sprint Retrospektive

### 10.4.1 Sternfisch Modell

#### Beibehalten

- Strukturierte Arbeitsweise
- Regelmässige Git Commits
- Schrittweise Umsetzung der Features
- Dokumentation direkt während der Entwicklung

#### Mehr davon

- Mehr Zeit für Design Verbesserungen
- Früheres Testen einzelner Funktionen
- Weitere moderne CSS Effekte ausprobieren

#### Weniger davon

- Zu lange an kleinen Design Details arbeiten
- Mehrere Änderungen gleichzeitig durchführen

#### Stoppen

- Unstrukturierte Änderungen ohne Planung
- Zu grosse Änderungen ohne Zwischenspeicherung

#### Neu anfangen

- Arbeiten mit separaten Git Branches
- Bessere Planung der nächsten Features
- Frühzeitige Vorbereitung des Backends

---

# 11 Sprint 2

## 11.1 Zeitraum

29.05.2026 - 18.06.2026

---

## 11.2 Sprintplanung

### 11.2.1 Sprintziel

Im zweiten Sprint wird die Website von einer rein statischen Seite zu einer dynamischen Anwendung weiterentwickelt. Dazu wird ein Python Backend mit FastAPI aufgebaut, eine PostgreSQL Datenbank angebunden und das Frontend über eine REST-API mit den Rezeptdaten verbunden. Zusätzlich werden die Live-Suche, der Kategorie-Filter und die Rezept-Detailseite umgesetzt.

---

### 11.2.2 Aufgaben

| Aufgabe | Status |
|---|---|
| FastAPI Backend aufsetzen | Erledigt |
| SQLAlchemy-Datenmodell für Rezepte erstellen | Erledigt |
| Pydantic-Schemas für Validierung erstellen | Erledigt |
| PostgreSQL Datenbank anbinden | Erledigt |
| REST-API für Rezepte erstellen (CRUD) | Erledigt |
| Such-Endpunkt im Backend umsetzen | Erledigt |
| Bild-Upload-Endpunkt umsetzen | Erledigt |
| CORS für Frontend-Zugriff konfigurieren | Erledigt |
| Frontend über die Fetch API anbinden | Erledigt |
| «Rezept der Woche» dynamisch laden | Erledigt |
| Live-Suche mit Dropdown umsetzen | Erledigt |
| Kategorie-Seite mit Filterfunktion erstellen | Erledigt (Grundfunktion steht, Verbesserungen geplant) |
| Rezept-Detailseite (recipe.html) erstellen | Erledigt |
| Lade-Animationen und Fallback-Anzeigen ergänzen | Erledigt |
| Deployment mit Railway vorbereiten | Erledigt |

---

### 11.2.3 Verwendete Technologien

- HTML
- CSS
- JavaScript (Fetch API)
- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- PostgreSQL
- Git
- GitHub
- Visual Studio Code
- Railway

---

## 11.3 Sprint Review

> Hinweis: Dieser Abschnitt ist ein Vorschlag und sollte nach dem tatsächlichen Review-Gespräch angepasst werden.

### 11.3.1 Durchgeführtes Review

Das Sprint Review Gespräch mit der Lehrperson findet am Ende des zweiten Sprints statt.

Dabei werden folgende Punkte präsentiert:

- Aufbau des FastAPI Backends
- Anbindung der PostgreSQL Datenbank
- Funktionsweise der REST-API (Swagger-Dokumentation)
- Dynamisches Laden der Rezepte im Frontend
- Live-Suche mit Dropdown
- Kategorie-Filter und Rezept-Detailseite
- Vorbereitung des Deployments

---

### 11.3.2 Offene Punkte für das Review

- Feedback zur Backend-Struktur einholen
- Sicherheit und Validierung besprechen
- Kategorie-Filter weiter verbessern (Workflow und Bedienung)
- Optimierung und Tests für Sprint 3 planen
- Deployment finalisieren

---

## 11.4 Sprint Retrospektive

> Hinweis: Dieser Abschnitt ist ein Vorschlag und sollte mit den eigenen Erfahrungen ergänzt werden.

### 11.4.1 Sternfisch Modell

#### Beibehalten

- Klare Trennung von Frontend und Backend
- Schrittweise Umsetzung der API-Endpunkte
- Testen der Endpunkte über die Swagger-Dokumentation

#### Mehr davon

- Frühzeitiges Testen der Datenbankverbindung
- Saubere Fehlerbehandlung im Frontend
- Dokumentation der API direkt während der Entwicklung

#### Weniger davon

- Funktionen ohne Zwischentests umsetzen
- Mehrere grössere Änderungen gleichzeitig

#### Stoppen

- Zugangsdaten direkt im Code statt in der `.env` Datei
- Änderungen ohne regelmässige Commits

#### Neu anfangen

- Arbeiten mit separaten Git Branches pro Feature
- Automatisierte Tests für die API
- Frühzeitige Planung des Deployments

---

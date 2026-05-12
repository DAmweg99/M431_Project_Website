# Meine Rezept Website

## Projektbeschreibung

Dieses Projekt ist eine selbst entwickelte Rezept-Website im Rahmen des Moduls M431. Ziel der Website ist es, eigene Rezepte online zu veröffentlichen, damit Benutzer diese anschauen und nachkochen können.

Die Website wird von Grund auf programmiert und beinhaltet sowohl Frontend- als auch Backend-Entwicklung.

---

# Projektziele

* Eigene Rezepte online veröffentlichen
* Moderne und benutzerfreundliche Website erstellen
* Frontend- und Backend-Entwicklung lernen
* SQL-Datenbanken verstehen und anwenden
* Website online deployen

---

# Geplante Funktionen

## Frontend

* Startseite
* Navigation
* Rezept der Woche
* Rezeptübersicht
* Suchfunktion
* Kategorien
* Responsive Design

## Backend

* REST API mit FastAPI
* Rezeptdaten verwalten
* Bilder speichern
* Admin-Bereich für Rezept-Uploads

## Datenbank

* PostgreSQL
* Speicherung von:

  * Rezepttitel
  * Beschreibung
  * Zutaten
  * Kochanleitung
  * Kategorien
  * Bilder

---

# Verwendete Technologien

## Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* Python
* FastAPI

## Datenbank

* PostgreSQL

## Tools

* Visual Studio Code
* GitHub

---

# Projektstruktur

```text
M431_PROJECT_WEBSITE
│
├── backend
│   └── main.py
│
├── css
│   └── style.css
│
├── js
│   └── app.js
│
├── index.html
│
└── README.md
```

---

# Installation

## Repository klonen

```bash
git clone <repository-url>
```

## Projekt öffnen

```bash
code .
```

---

# Projekt starten

## Frontend

Mit der VS Code Extension "Live Server":

* index.html öffnen
* Rechtsklick
* "Open with Live Server"

## Backend

```bash
uvicorn backend.main:app --reload
```

---

# Lernziele

Während dieses Projekts werden folgende Themen vertieft:

* HTML Strukturierung
* CSS Layouts und Design
* Flexbox
* JavaScript Grundlagen
* Python Backend-Entwicklung
* REST APIs
* SQL und PostgreSQL
* Git und GitHub
* Deployment

---

## Projektmethode

Das Projekt wird mit einem agilen Vorgehen umgesetzt.
Die Entwicklung erfolgt schrittweise in mehreren kleinen Sprints.

Jeder Sprint beinhaltet:
- Planung der nächsten Funktionen
- Umsetzung der Features
- Testen der Website
- Verbesserung des Designs und der Benutzerfreundlichkeit

Da das Projekt alleine entwickelt wird, erfolgt die Organisation
vereinfacht ohne komplexes Scrum-Management oder Issue-Tracking.

Die Aufgaben werden direkt in einzelne Arbeitsschritte unterteilt
und laufend dokumentiert.

## Sprintplanung

### Sprint 1 – Projektaufbau
- GitHub Repository erstellen
- Projektstruktur erstellen
- HTML / CSS / JavaScript vorbereiten
- Erste Startseite erstellen

### Sprint 2 – Design & Benutzeroberfläche
- Modernes Layout erstellen
- Header und Navigation designen
- Hero-Section mit Suchfeld erstellen
- Popup-Welcome Fenster erstellen

### Sprint 3 – Rezeptbereich
- "Rezept der Woche" entwickeln
- Bilder und Buttons hinzufügen
- Hover-Effekte und Styling verbessern

### Sprint 4 – Backend & Datenbank
- Python Backend vorbereiten
- Verbindung zur SQL-Datenbank planen
- Rezeptdaten speichern und abrufen

### Sprint 5 – Optimierung & Testing
- Fehler beheben
- Responsive Design verbessern
- Benutzerfreundlichkeit optimieren
- Abschlussdokumentation erstellen

## Risiken

| Risiko | Beschreibung |
|---|---|
| Zeitmanagement | Einzelne Features benötigen mehr Zeit als geplant |
| Neue Technologien | Fehlende Erfahrung mit Backend und Datenbanken |
| Designänderungen | Häufige Anpassungen am Layout können zusätzlichen Aufwand verursachen |
| Fehlersuche | Kleine Syntaxfehler können grosse Probleme verursachen |
| Datenbankanbindung | Verbindung zwischen Frontend und Backend könnte komplex werden |

## Zielsetzung

Ziel des Projektes ist die Entwicklung einer modernen Rezept-Website,
auf welcher eigene Rezepte veröffentlicht werden können.

Die Website soll:
- modern und benutzerfreundlich sein
- ein ansprechendes Design besitzen
- eine Suchfunktion enthalten
- Rezepte übersichtlich darstellen
- mit einer SQL-Datenbank erweitert werden können
- online verfügbar sein

## Technologien

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Python

Datenbank:
- PostgreSQL

Versionsverwaltung:
- Git & GitHub

Entwicklungsumgebung:
- Visual Studio Code

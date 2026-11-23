# Passanten-Dashboard Bahnhofstrasse Zürich

Web-Applikation zur Erkundung der Passantenfrequenzen an vier Standorten der Bahnhofstrasse Zürich (Pilotprojekt der Stadt Zürich, Daten seit 2021, Quelle: Open Data Portal der Stadt Zürich).

Projektarbeit im Modul 3050 Webprogrammierung und interaktive Datenvisualisierung (FHNW, Institut Geomatik).

## Fokusfrage

**An welchem Tag und Standort pro Monat ist das Personenaufkommen am höchsten?**

Die App beantwortet die Frage mit einem Satz unter dem Liniendiagramm. Er berücksichtigt die gewählten Standorte, das Jahr und den Monat.

## Funktionen

- **Auswahl** von Jahr, Monat und Standorten (Checkboxen oder Klick auf die Karte).
- **Karte** (React-Leaflet) mit den vier Standorten.
- **Balkendiagramm:** Passanten pro Monat im gewählten Jahr. Ein Klick auf einen Balken wählt den Monat.
- **Liniendiagramm:** Passanten pro Tag im gewählten Monat, eine Linie pro Standort. Werktage und Wochenenden sind im Hintergrund unterschieden.
- **Tooltips** mit Passanten, Temperatur sowie Anteil Kinder und Erwachsene.

## Technologien

| Bereich | Technologie |
|---|---|
| Frontend | React, Vite, CSS, React-Leaflet, Vega / Vega-Embed |
| Backend | Python, FastAPI, Pandas, Altair |

Das Backend lädt `Gesamtdatensatz.csv` beim Start in einen Pandas-DataFrame (Arbeitsspeicher). Das Frontend erhält nur aggregierte Daten (pro Monat bzw. pro Tag) und die Vega-Lite-Spezifikationen der Diagramme.

## Voraussetzungen

- Python 3.10 oder neuer
- Node.js (inkl. npm)
- Die Datei `Gesamtdatensatz.csv` (aus Moodle) im Ordner `Backend/`

## Starten

Backend und Frontend laufen als zwei getrennte Prozesse (zwei Terminals).

**Terminal 1: Backend**

```bash
cd Backend
pip install fastapi "uvicorn[standard]" pandas altair
python -m uvicorn main:app --reload
```

Das Backend läuft auf http://localhost:8000, die API-Dokumentation steht unter http://localhost:8000/docs.

**Terminal 2: Frontend**

```bash
cd Frontend
npm install
npm run dev
```

Die App läuft auf http://localhost:5173.

> Das Backend erlaubt per CORS nur die Ports 5173 und 5174. Läuft Vite auf einem anderen Port, muss `allow_origins` in `Backend/main.py` angepasst werden.

## API (Auswahl)

| Endpunkt | Inhalt |
|---|---|
| `GET /api/data/monate?jahr=…&standorte=…` | Passanten pro Monat (mehrere `standorte` möglich) |
| `GET /api/data/tage?jahr=…&monat=…` | Passanten pro Tag und Standort |
| `GET /api/spec/bar` | Vega-Lite-Spezifikation Balkendiagramm |
| `GET /api/spec/line` | Vega-Lite-Spezifikation Liniendiagramm |

## Projektstruktur

```
Backend/    FastAPI-Server, Datenaufbereitung, Diagramm-Specs
Frontend/   React-App (Header, Sidebar, Karte, MainArea, Footer)
```

## Hinweise zu den Daten

- Zeitstempel werden in die Zeitzone Europe/Zurich umgerechnet.
- Nicht verifizierte Messwerte (`unverified`) werden nicht berücksichtigt.
- In den Daten fehlen einzelne Monate (z. B. 2021 vor September). Diese werden in der Auswahl nicht angezeigt.

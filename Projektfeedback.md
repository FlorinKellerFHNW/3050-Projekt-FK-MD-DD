# Projektfeedback: Abgleich Projekt mit Modulinhalt

Grundlage: Aufgabenstellung Projektarbeit (PDF), Folien WID 1–8, Übungen (inkl. Lektion 7 und 9), `Forschungsfrage.txt`, `Projektbeschreibung_Passanten_Dashboard.md` und der aktuelle Code im Branch `FK-optische-Verbesserungen`.

Legende: **Priorität** hoch = Minimalanforderung nicht erfüllt, mittel = Qualität/Prüfungsrisiko, tief = Aufräumen.

---

## 1. Fehlende Anforderungen (Priorität hoch)

### 1.1 Fokusfrage nicht beantwortet
- **Kritik:** In `Forschungsfrage.txt` steht: «An welchem Tag pro Monat ist das Personenaufkommen pro Standort am höchsten?» Die App zeigt Monatsbalken und Tageslinien, markiert aber keinen Spitzentag und beantwortet die Frage nicht direkt.
- **Warum:** Die erste Minimalanforderung lautet «Die Web-Applikation beantwortet eine der Fokusfragen». Die Nutzenden müssten die Antwort selbst im Liniendiagramm suchen.
- **Vorschlag:** Backend berechnet pro Standort den Tag mit dem Maximum (`idxmax`). Das Frontend markiert ihn im Liniendiagramm und nennt ihn in einem Text.

### 1.2 README.md ist leer
- **Kritik:** Die Datei hat 1 Byte.
- **Warum:** Die README ist Teil der Finalisierung. Dozierende müssen Inhalt, Fokus und Startbefehle für Frontend und Backend finden, um die App auf localhost zu starten.
- **Vorschlag:** Kurzbeschreibung, Fokusfrage, Technologien, Start (`uvicorn main:app --reload`, `npm i`, `npm run dev`), Ports und Voraussetzungen (Python-Pakete) ergänzen.

### 1.3 MUI nicht eingebaut
- **Kritik:** Es gibt kein `@mui/material` in `package.json`. Checkboxen und Dropdowns sind rohes HTML (`<input>`, `<select>`).
- **Warum:** Die Aufgabenstellung nennt «React, MUI und CSS für das User-Interface». MUI war Stoff in WID 6 und Übung im Erdbebenmonitor.
- **Vorschlag:** `Select`, `Checkbox`/`FormControlLabel` und evtl. `Typography` aus MUI in der Sidebar verwenden.


---

## 2. Code, der im Modul nicht behandelt wurde (Priorität mittel, Prüfungsrisiko)

In der mündlichen Prüfung müssen auch Teile erklärt werden, die die KI geschrieben hat. Die folgenden Konstrukte kommen in Folien und Übungen nicht oder nur ansatzweise vor.

| Stelle | Konstrukt | Warum kritisch | Vorschlag |
|---|---|---|---|
| `MainArea.jsx` | `useMemo` (`rowsBarMarkiert`, `rowsLineMarkiert`) | In keiner Übung und keiner Folie vorhanden, ausserdem nicht nötig für die Funktion. | Durch normale Variablen ersetzen oder genau erklären können. |
| `VegaChart.jsx` | `onClickRef` und `latest.current = data` | `useRef` wird in der Lektion-9-Vorlage gezeigt, das Muster mit dem Click-Handler-Ref nicht. | Muster im Kommentar erklären oder Handler als Prop direkt nutzen. |
| `VegaChart.jsx` | `view.addEventListener("click", …)` | Klick-Events in Vega sind nicht Stoff. | Kurz dokumentieren, wie Vega-Events funktionieren. |
| `main.py` | `alt.condition("datum.aktiv", …)` und `datum.ausgewaehlt` | Vega-Expressions gehen über das Altair-Tutorial hinaus. | In der README oder im Code kommentieren. |
| `main.py` | `transform_calculate`, `transform_aggregate`, `.resolve_scale(color="independent")` | Fortgeschrittene Altair-Funktionen für den Wochenend-Hintergrund. | Entweder vereinfachen oder gemeinsam durchgehen. |
| `main.py` | `Response(df.to_json(...), media_type=…)`, `Query(default=[])` | Normale FastAPI-Rückgabe ist Stoff, diese Varianten nicht. | Begründen können (Mehrfachparameter, NaN-Handling). |
| `App.jsx` | `aendereJahr` korrigiert den Monat automatisch | Abgeleiteter Zustand ist nicht behandelt und eine mögliche Fehlerquelle. | Logik kommentieren. |

---

## 3. Qualität und Struktur (Priorität mittel)

### 3.1 Fehlerbehandlung und Nutzer-Feedback
- **Kritik:** Nur `App.jsx` prüft `res.ok`. In `MainArea.jsx` fehlt das, und es gibt keine Lade- oder Fehlermeldung in der Oberfläche (nur `console.error`).
- **Warum:** Das Kapitel User-Interface-Design verlangt Rückmeldung an die Nutzenden. Bei gestopptem Backend sieht man leere Diagramme ohne Hinweis.
- **Vorschlag:** `error`- und `loading`-State, dazu eine kurze Meldung im UI (z. B. MUI `Alert`, `CircularProgress`).

### 3.2 Datenlücken nicht erkennbar
- **Kritik:** Die Dropdowns blenden fehlende Monate stillschweigend aus. Der Footer nennt nur den Gesamtzeitraum.
- **Warum:** Die Projektbeschreibung (Abschnitt 2) verlangt, dass die Lücken in Footer oder Tooltip erkennbar sind.
- **Vorschlag:** Footer-Hinweis: «2021 ab Sept., 2025 bis Juli; fehlende Monate werden nicht angezeigt.»

### 3.3 Aufgabenverteilung zwischen App und MainArea
- **Kritik:** `App` lädt `meta`, `MainArea` lädt Specs und Daten selbst.
- **Warum:** Die Projektbeschreibung sieht vor, dass `App` Auswahl hält und Daten lädt. Die Aufteilung ist uneinheitlich und schwerer zu erklären.
- **Vorschlag:** Entweder alle Fetches nach `App` verschieben oder die Entscheidung in der README begründen.

### 3.4 Doppelte hartkodierte API-URL
- **Kritik:** `const API = 'http://localhost:8000/api'` steht in `App.jsx` und `MainArea.jsx`.
- **Warum:** Doppelter Code, bei einer Port-Änderung muss man zwei Stellen anpassen.
- **Vorschlag:** Einmal in `konstante.js` definieren und importieren.

### 3.5 CORS nur für zwei feste Ports
- **Kritik:** `allow_origins` enthält nur `5173` und `5174`.
- **Warum:** Läuft Vite auf einem anderen Port, schlagen alle Requests still fehl.
- **Vorschlag:** In der README den erwarteten Port nennen.

---

## 4. Aufräumen (Priorität tief)

- **Footer-Datum:** «Erstellt am: 21. Nov. 2026». Die Aufgabenstellung nennt als Abgabe den 23.12.2025. Datum auf Moodle prüfen und im Footer anpassen.
- **`Backend/__pycache__`:** Sicherstellen, dass es in `.gitignore` steht.
- **`Frontend/src/index.css`:** Leere Datei, die importiert wird. Entweder füllen oder entfernen.
- **Zwei `package-lock.json`:** Eine liegt im Projektroot, eine im `Frontend`. Die im Root ist vermutlich überflüssig.
- **GeoJSON im Frontend statt Backend:** Die Projektbeschreibung nannte beide Varianten. Entscheidung kurz begründen können.
- **Namen und Sprache:** Mischung aus Deutsch und Englisch (`App`, `MainArea`, `Karte`, `umschalten`). Ist akzeptabel, aber einheitlicher wäre besser.
- **Einrückung und Format:** In `App.jsx` und `main.py` ist die Einrückung uneinheitlich (z. B. `.then`-Ketten, `color=alt.Color(...)`). Mit Prettier/Black formatieren.

---

## 5. Was gut passt

- FastAPI mit Pandas-DataFrame im RAM, nur aggregierte Daten gehen ans Frontend.
- Endpunkte pro Zweck mit Parametern statt pro Abfrage.
- React-Leaflet mit klickbaren Polygonen, synchron mit den Checkboxen.
- Zeitzonenumrechnung nach `Europe/Zurich` und Filter auf `unverified`.
- Trennung von Spec (Backend) und Daten, wie in der Lektion-9-Vorlage.
- Klare Komponentenstruktur (Header, Sidebar, MainArea, Footer) und CSS Grid für das Layout.

---

## 6. Empfohlene Reihenfolge

1. Fokusfrage sichtbar beantworten (1.1).
2. README schreiben (1.2).
3. MUI für Sidebar einbauen (1.3).
4. Alle Konstrukte aus Abschnitt 2 gemeinsam durchgehen und erklären können.
5. Fehler- und Lade-Feedback sowie Datenlücken-Hinweis (3.1, 3.2).
6. Aufräumen (Abschnitt 4).

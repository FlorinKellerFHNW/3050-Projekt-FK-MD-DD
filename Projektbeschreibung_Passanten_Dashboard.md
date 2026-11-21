# Projektbeschreibung: Passanten-Dashboard Zürich

Modul 3050 Webprogrammierung, Projektarbeit Passantenfrequenzen

## 1. Ziel

Eine Webanwendung (Frontend + Backend), die Passantenfrequenzen an vier Messstandorten in Zürich interaktiv darstellt. Eine Auswahl in der Sidebar (Standort, Jahr, Monat) verändert die Diagramme im Hauptbereich.

Beispiel: Der Nutzer wählt den Standort **Mitte** und das Jahr **2024**. Das Balkendiagramm zeigt nur noch Mitte, im Liniendiagramm sind die anderen Standorte abgeschwächt.

## 2. Datengrundlage

| Datei | Inhalt |
|---|---|
| `Gesamtdatensatz.csv` | Stündliche Zählwerte (Hystreet), 134'440 Zeilen, 4 Standorte mit je 33'610 Zeilen, Zeitraum 29.09.2021 bis 30.07.2025 |
| `hystreet_locations.json` | GeoJSON mit den 4 Zonen-Polygonen (`hystreet_location_id`, `name`, `city`) |

**Standorte** (exakte `location_name` im Datensatz):
- Bahnhofstrasse (Mitte), ID 329
- Bahnhofstrasse (Nord), ID 331
- Bahnhofstrasse (Süd), ID 330
- Lintheschergasse, ID 670 (in der Legende als "Gasse" gedacht)

**Relevante Spalten:** `timestamp` (UTC), `location_name`, `temperature`, `pedestrians_count`, `adult_pedestrians_count`, `child_pedestrians_count`, `weather_condition`, optional `ltr_/rtl_` und `zone_1…3`.

**Zu beachten:**
- `timestamp` ist UTC und muss auf Europe/Zurich umgerechnet werden, sonst stimmen Tage und Monate nicht.
- 2021 enthält nur Daten ab Ende September, 2025 nur bis Ende Juli. Diese Lücken müssen in der Darstellung erkennbar sein (Footer oder Tooltip).

## 3. Aufbau der Seite

```
┌──────────────────────────────────────────┐
│ Header                                   │
├───────────┬──────────────────────────────┤
│ Sidebar   │ MainArea                     │
│           │  - Balkendiagramm            │
│           │  - Liniendiagramm            │
├───────────┴──────────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
```

### 3.1 Header
- Titel des Projekts
- Zusätzliche Infos (zum Beispiel Datenquelle, Zeitraum, Kurzbeschreibung)

### 3.2 Sidebar
Alle Elemente sind anklickbar bzw. wählbar. Eine Auswahl wirkt sich auf die Diagramme aus.

- **Legende mit 4 Standorten** (Lintheschergasse, Bahnhof Nord, Bahnhof Süd, Bahnhof Mitte), anklickbar, jeder Standort mit eigener Farbe
- **Karte** mit den 4 eingezeichneten Zonen (Polygone aus `hystreet_locations.json`), Zonen anklickbar
- **Dropdown Jahr**
- **Dropdown Monat**

Legende und Karte sind miteinander synchron: Ein Klick auf einen Standort in der Karte entspricht einem Klick in der Legende.

### 3.3 MainArea

**Balkendiagramm**
- x = Monate
- y = Gesamtanzahl Passanten
- Reagiert auf den gewählten Standort (nur dieser Standort wird gezeigt) und auf das gewählte Jahr

**Liniendiagramm**
- x = Tage des Monats (1–31)
- 4 Linien, eine pro Standort
- Bei Auswahl eines Standorts bleiben alle Linien sichtbar, die nicht gewählten sind schwächer eingefärbt
- **Tooltip** pro Datenpunkt mit zusätzlichen Werten, zum Beispiel:
  - Minimale und maximale Temperatur
  - Anteil Kinder und Erwachsene
  - weitere Werte (offen, siehe Abschnitt 6)

### 3.4 Footer
Einige Zusatzinformationen (zum Beispiel Datenquelle, Zeitraum, Hinweis auf Datenlücken, Autor, Modul).

## 4. Interaktion (Verhalten bei Auswahl)

| Auswahl | Balkendiagramm | Liniendiagramm |
|---|---|---|
| Standort | nur dieser Standort | dieser Standort hervorgehoben, andere abgeschwächt |
| Jahr | Monatswerte dieses Jahres | (je nach Monatsauswahl) |
| Monat | keine Änderung | Tageswerte dieses Monats |

## 5. Backend (Konzept, ohne Code)

Das Backend bleibt ein einzelnes Python-Programm. Es gibt **nicht einen Endpoint pro möglicher Abfrage**, sondern pro Diagramm bzw. Zweck einen Endpoint. Die Auswahl (Standort, Jahr, Monat) wird als Parameter mitgeschickt.

Geplante Endpoints:

- **Spec Balkendiagramm** und **Spec Liniendiagramm**: Diagrammbeschreibung, wird einmal beim Start geladen
- **Monatswerte**: Summe pro Monat, optional gefiltert nach Jahr und Standort
- **Tageswerte**: Werte pro Tag und Standort für einen Monat, inklusive Tooltip-Werte (min/max Temperatur, Kinder, Erwachsene)
- **Meta**: verfügbare Jahre und Monate für die Dropdowns, Infos für den Footer
- **Standorte/Zonen**: GeoJSON für die Karte (alternativ direkt im Frontend)

Prinzipien:
- Daten werden beim Start einmal geladen, Zeit auf Europe/Zurich umgerechnet, Jahr/Monat/Tag als Spalten vorberechnet
- Aggregation (Summe, Min, Max) im Backend, Darstellung (Hervorhebung, Farben) im Frontend
- Das Liniendiagramm bekommt immer alle 4 Standorte, die Abschwächung ist nur Darstellung

## 6. Offene Entscheidungen

1. **Balkendiagramm bei "alle Standorte"**: gestapelt oder summiert? (Mitte/Nord/Süd liegen auf derselben Strasse, die Lintheschergasse ist eine andere.)
- die Summe aller Standorte für jeden Monat
2. **Default-Monat/-Jahr**, wenn noch nichts gewählt wurde. Das Liniendiagramm braucht zwingend einen Monat und ein Jahr.
- Januar 2024
3. **Mehrfachauswahl** von Standorten oder immer nur einer?
- Mehrfachauswahl möglich
4. **Weitere Tooltip-Werte** (zum Beispiel Wetter, Laufrichtung, Zonen).
- wetter kann man nicht auf einen gesamten Tag darstellen, daher weglassen!
- Laufrichtung weglassen vorerst
- Zonen weglassen
5. **Umgang mit den Datenlücken** 2021 und 2025.
- falls keine Daten Vorhanden sind, keine Darstellen
6. **Benennung**: "Gasse" in der Legende vs. `Lintheschergasse` im Datensatz.
- Lintheschergasse verwenden

## 7. Geplante Struktur Frontend

- `App`: hält die Auswahl (Standort, Jahr, Monat) und lädt die Daten
- `Header`, `Sidebar` (Legende, Karte, Dropdowns), `MainArea` (Balken- und Liniendiagramm), `Footer`

## 8. Nächste Schritte

1. Offene Entscheidungen aus Abschnitt 6 

2. Backend: Daten laden und aufbereiten, Endpoints definieren
3. Specs für beide Diagramme festlegen
4. Frontend-Grundgerüst (Layout)
5. Sidebar mit Auswahl, Verbindung zu den Diagrammen
6. Tooltips, Hervorhebung, Footer

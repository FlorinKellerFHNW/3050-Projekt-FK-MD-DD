import pandas as pd
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Response, Query
import altair as alt


MONATE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]


# lädt die Daten mit ausgewählten Spalten
df = pd.read_csv("Gesamtdatensatz.csv", parse_dates=["timestamp"], usecols=[
    "timestamp",
        "location_name",
        "temperature",
        "pedestrians_count",
        "adult_pedestrians_count",
        "child_pedestrians_count",
        "unverified",
    ],
)

# Zeit umrechnen zur Zeitzone
df = df[~df["unverified"]]

lokal = df["timestamp"].dt.tz_convert("Europe/Zurich")
df["jahr"] = lokal.dt.year
df["monat"] = lokal.dt.month
df["tag"] = lokal.dt.day
df["tagestyp"] = lokal.dt.dayofweek.map(lambda i: "Wochenende" if i >= 5 else "Werktag")


# Aggregation nach Monatswerten für Balkendiagramm
monate = (
    df.groupby(["location_name", "jahr", "monat"], as_index=False)
    .agg(passanten=("pedestrians_count", "sum"))
)

# Aggregation Tageswerte für Liniendiagramm
tage = (
    df.groupby(["location_name", "jahr", "monat", "tag", "tagestyp"], as_index=False)
    .agg(
        passanten=("pedestrians_count", "sum"),
        temp_min=("temperature", "min"),
        temp_max=("temperature", "max"),
        erwachsene=("adult_pedestrians_count", "sum"),
        kinder=("child_pedestrians_count", "sum"),
    )
)

# Anteil Kinder / Erwachsene
tage["anteil_kinder"] = (tage["kinder"] / tage["passanten"] * 100).round(1)
tage["anteil_erwachsene"] = (tage["erwachsene"] / tage["passanten"] * 100).round(1)

# FastAPI Gerüst
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint Meta
@app.get("/api/meta")
def meta():
    return {
        "standorte": sorted(df["location_name"].unique().tolist()),
        "verfuegbar": monate[["jahr", "monat"]].drop_duplicates().to_dict("records"),
    }

# Endpoint Monate
@app.get("/api/data/monate")
def data_monate(jahr: int, standorte: list[str] = Query(default=[])):
    auswahl = monate[monate["jahr"] == jahr]
    if standorte:
        auswahl = auswahl[auswahl["location_name"].isin(standorte)]
    ergebnis = auswahl.groupby("monat", as_index=False).agg(
        passanten=("passanten", "sum")
    )
    ergebnis["monat_name"] = ergebnis["monat"].map(lambda i: MONATE[i - 1])

    return Response(ergebnis.to_json(orient="records"), media_type="application/json")

# Endpoint Tage
@app.get("/api/data/tage")
def data_tage(jahr: int, monat: int):
    auswahl = tage[(tage["jahr"] == jahr) & (tage["monat"] == monat)]
    auswahl = auswahl[
        [
            "location_name",
            "tag",
            "passanten",
            "temp_min",
            "temp_max",
            "anteil_kinder",
            "anteil_erwachsene",
            "tagestyp",
        ]
    ]
    return Response(auswahl.to_json(orient="records"), media_type="application/json")

# Balkendiagramm
@app.get("/api/spec/bar")
def spec_bar():
    chart = (
        alt.Chart(alt.NamedData(name="monate"))
        .mark_bar()
        .encode(
            x=alt.X("monat_name:O", sort=MONATE, title="Monat"),
            y=alt.Y("passanten:Q", title="Passanten"),
            tooltip=[
                alt.Tooltip("monat_name:O", title="Monat"),
                alt.Tooltip("passanten:Q", title="Passanten", format=","),
            ],
        )
        .properties(width="container", height=250)
    )
    return chart.to_dict()

# Liniendiagramm
@app.get("/api/spec/line")
def spec_line():
    farben = alt.Scale(
        domain=["Werktag", "Wochenende"],
        range=["#cfe3f5", "#f5d9b8"],
    )

    hintergrund = (
        alt.Chart(alt.NamedData(name="tage"))
        .transform_calculate(von="datum.tag - 0.5", bis="datum.tag + 0.5")
        .transform_aggregate(groupby=["von", "bis", "tagestyp"])
        .mark_rect(opacity=0.6)
        .encode(
            x=alt.X("von:Q", axis=None),
            x2="bis:Q",
            color=alt.Color("tagestyp:N", scale=farben, title="Tagestyp"),
        )
    )

    linien = (
        alt.Chart(alt.NamedData(name="tage"))
        .mark_line(point=True)
        .encode(
            x=alt.X("tag:Q", title="Tag"),
            y=alt.Y("passanten:Q", title="Passanten"),
            color=alt.Color("location_name:N", title="Standort"),
            tooltip=[
                alt.Tooltip("location_name:N", title="Standort"),
                alt.Tooltip("tag:Q", title="Tag"),
                alt.Tooltip("passanten:Q", title="Passanten", format=","),
                alt.Tooltip("temp_min:Q", title="Temp. min (°C)"),
                alt.Tooltip("temp_max:Q", title="Temp. max (°C)"),
                alt.Tooltip("anteil_kinder:Q", title="Kinder (%)"),
                alt.Tooltip("anteil_erwachsene:Q", title="Erwachsene (%)"),
            ],
        )
    )

    chart = (
        alt.layer(hintergrund, linien)
        .resolve_scale(color="independent")
        .properties(width="container", height=250)
    )
    return chart.to_dict()


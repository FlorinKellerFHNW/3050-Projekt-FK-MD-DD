// VegaChart.jsx
// =============================================================================
// Zeigt eine Vega-Lite-Spec an (Variante B: Spec und Daten getrennt).
//
// Ablauf:
//   1. Sobald Spec UND Daten da sind, wird der Chart EINMAL gezeichnet (vega-embed).
//   2. Kommen neue Daten, wird NICHT neu gezeichnet, sondern nur der Datensatz
//      mit dem Namen `name` im bestehenden Chart ersetzt: view.data(name, data).
//
// Props:
//   spec  Vega-Lite-Spec mit Platzhalter {"data": {"name": "..."}}
//   data  Array von Datensätzen, z. B. [{stunde: 0, n: 3.8}, ...]
//   name  Name des Platzhalters in der Spec (hier "passanten")
// =============================================================================

import { useEffect, useRef } from "react";
import embed from "vega-embed";   // Bibliothek, die eine Spec in ein DOM-Element zeichnet

export const VegaChart = ({ spec, data, name }) => {
  // useRef speichert Werte über Renders hinweg, OHNE ein neues Rendern auszulösen.
  const container = useRef(null);   // das <div>, in das Vega zeichnet (Vega arbeitet direkt im DOM, nicht über JSX)
  const view = useRef(null);        // die Vega-"View": darüber tauschen wir später die Daten
  const latest = useRef(data);      // immer die aktuellsten Daten (siehe Kommentar in Effekt 1)
  latest.current = data;            // bei jedem Render aktualisieren

  // ---------------------------------------------------------------------------
  // Effekt 1: Chart zeichnen. Läuft nur, wenn sich `spec` oder `name` ändern,
  // in unserer App also genau einmal.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!spec) return;   // Spec noch nicht vom Backend geladen -> nichts tun

    let result;          // Ergebnis von embed(), brauchen wir zum Aufräumen

    // Die aktuellsten Daten direkt in eine Kopie der Spec schreiben (unter "datasets",
    // Schlüssel = Platzhalter-Name). So wird der Chart gleich beim ersten Zeichnen
    // mit Daten gerendert und nicht leer (ein leerer Chart erzeugt in der Konsole
    // Warnungen wie "Infinite extent for field ...").
    const startSpec = {
      ...spec,
      datasets: { ...spec.datasets, [name]: latest.current ?? [] },
    };

    // embed() ist asynchron (Promise): Der Chart ist erst in .then() fertig.
    embed(container.current, startSpec, { actions: false })   // actions: false = kein "..."-Menü
      .then((res) => {
        result = res;
        view.current = res.view;   // View merken, damit Effekt 2 darauf zugreifen kann
      });

    // Aufräumfunktion: läuft, bevor der Effekt erneut ausgeführt wird oder die
    // Komponente verschwindet. finalize() gibt Event-Listener und Speicher frei.
    return () => {
      result?.finalize();
      view.current = null;
    };
  }, [spec, name]);

  // ---------------------------------------------------------------------------
  // Effekt 2: Daten tauschen. Läuft bei jeder Änderung von `data`.
  // Der Chart bleibt bestehen; Vega aktualisiert nur Balken und Achsen.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (view.current && data) {
      view.current
        .data(name, data)   // Datensatz "passanten" komplett ersetzen
        .runAsync();        // Vega neu berechnen und zeichnen lassen
    }
  }, [data, name]);

  // width: 100% ist nötig, weil die Spec width: "container" verwendet:
  // Vega übernimmt die Breite dieses <div>.
  return <div ref={container} style={{ width: "100%" }} />;
};

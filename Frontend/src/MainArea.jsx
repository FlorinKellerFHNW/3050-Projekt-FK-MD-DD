import { useEffect, useState } from "react";
import { VegaChart } from "./VegaChart";
import { MONATE} from "./konstante"

const API = "http://localhost:8000/api";
 

export const MainArea = ({ jahr = 2024,  monat = 1, ausgewaehlteStandorte = [], setMonat}) => {
    const [specBar, setSpecBar] = useState(null);
    const [rowsBar, setRowsBar] = useState(null);
    const [specLine, setSpecLine] = useState(null);
    const [rowsLine, setRowsLine] = useState(null);

    useEffect(() => {
        fetch(`${API}/spec/bar`)
            .then((res) => res.json())
            .then((res) => setSpecBar(res))
            .catch((err) => console.error("Spec Bar konnte nicht geladen werden", err));
    }, []);

    useEffect(() => {
        const standorteParam = (ausgewaehlteStandorte ?? [])
            .map((name) => `&standorte=${encodeURIComponent(name)}`)
            .join("");

        fetch(`${API}/data/monate?jahr=${jahr}${standorteParam}`)
            .then((res) => res.json())
            .then((res) => setRowsBar(res))
            .catch((err) => console.error("Monate konnten nicht geladen werden:", err));
    }, [jahr, ausgewaehlteStandorte]);


    useEffect(() => {
        fetch(`${API}/spec/line`)
            .then((res) => res.json())
            .then((res) => setSpecLine(res))
            .catch((err) => console.error("Spec Line konnte nicht geladen werden", err));
    }, []);

    useEffect(() => {
        fetch(`${API}/data/tage?jahr=${jahr}&monat=${monat}`)
            .then((res) => res.json())
            .then((res) => setRowsLine(res))
            .catch((err) => console.error("Tage konnten nicht geladen werden:", err));
    }, [jahr, monat]);

    const rowsBarMarkiert = rowsBar?.map((zeile) => ({
        ...zeile,
        aktiv: zeile.monat === monat,
    }));

    const gewaehlt = ausgewaehlteStandorte ?? [];
    const rowsLineMarkiert = rowsLine?.map((zeile) => ({
        ...zeile,
        ausgewaehlt: gewaehlt.length === 0 || gewaehlt.includes(zeile.location_name),
    }));

    const sichtbareZeilen = rowsLineMarkiert?.filter((zeile) => zeile.ausgewaehlt) ?? [];
    const maxPassanten = Math.max(...sichtbareZeilen.map((zeile) => zeile.passanten));
    const spitze = sichtbareZeilen.find((zeile) => zeile.passanten === maxPassanten);

    return (
        <main className="main-area">
            <section>
                <div className="fokusfrage">
                    <h2>Fokusfrage:</h2>
                    <h3>An welchem Tag und Standort pro Monat ist das Personenaufkommen am höchsten?</h3>
                </div>
                <h2>Anzahl Passanten pro Monat im Jahr {jahr}</h2>
                {specBar && rowsBar && (
                    <VegaChart spec={specBar} data={rowsBarMarkiert} name="monate" onClick={(zeile) => setMonat?.(zeile.monat)} />
                )}
            </section>

            <section>
                <h2>Anzahl Passanten pro Tag im {MONATE[monat - 1]} {jahr}</h2>
                {specLine && rowsLine && (
                    <>
                        <VegaChart spec={specLine} data={rowsLineMarkiert} name="tage" />

                        {spitze && (
                            <p>
                                Das höchste Passantenaufkommen im {MONATE[monat - 1]} {jahr} war
                                am {spitze.tag}. {MONATE[monat - 1]} am Standort {spitze.location_name} mit {spitze.passanten} Passanten.
                            </p>
                        )}
                    </>
                )}
            </section>
        </main>
    );
};
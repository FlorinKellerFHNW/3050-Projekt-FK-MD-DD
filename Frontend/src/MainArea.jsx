import { useEffect, useState } from "react";
import { VegaChart } from "./VegaChart";
import { MONATE} from "./konstante"

const API = "http://localhost:8000/api";
 

export const MainArea = ({ jahr = 2024,  monat = 1, standorte = [], setMonat}) => {
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
        fetch(`${API}/data/monate?jahr=${jahr}`)
            .then((res) => res.json())
            .then((res) => setRowsBar(res))
            .catch((err) => console.error("Monate konnten nicht geladen werden:", err));
    }, [jahr]);

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


    return(
        <main className="main-area">
            <section>
                <h2>Anzahl Passanten pro Monat im Jahr {jahr}</h2>
                {specBar && rowsBar && (
                    <VegaChart spec={specBar} data={rowsBar} name="monate" onClick={(zeile) => setMonat?.(zeile.monat)}/>
            )}
            </section>

            <section>
                <h2>Anzahl Passanten pro Tag im {MONATE[monat - 1]} {jahr}</h2>
            {specLine && rowsLine && (
                <VegaChart spec={specLine} data={rowsLine} name="tage" />
            )}
            </section>
        </main>
    )
}
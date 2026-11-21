import { useEffect, useState } from "react";
import { VegaChart } from "./VegaChart";

const API = "http://localhost:8000/api";

export const MainArea = ({ jahr = 2024,  monat = 1, standorte = []}) => {
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
        <main>
            {specBar && rowsBar && (
                <VegaChart spec={specBar} data={rowsBar} name="monate" />
            )}
            {specLine && rowsLine && (
                <VegaChart spec={specLine} data={rowsLine} name="tage" />
            )}

        </main>
    )
}
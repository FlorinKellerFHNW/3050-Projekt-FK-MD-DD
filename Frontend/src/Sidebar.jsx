import { MONATE, STANDORT_REIHENFOLGE } from './konstante'

function Sidebar({
    standorte, farben, ausgewaehlteStandort, setAusgewaehlteStandort,
    jahr, monat, verfuegbar, aendereJahr, setMonat,
}) {
const jahre = [...new Set(verfuegbar.map((v) => v.jahr))]
const monate = verfuegbar.filter((v) => v.jahr === jahr).map((v) => v.monat)
const sortierteStandorte = [...standorte].sort(
    (a, b) => STANDORT_REIHENFOLGE.indexOf(a) - STANDORT_REIHENFOLGE.indexOf(b)
)
const umschalten = (name) => {
        if (ausgewaehlteStandort.includes(name)) {
            setAusgewaehlteStandort(ausgewaehlteStandort.filter((n) => n !== name))
        } else {
            setAusgewaehlteStandort([...ausgewaehlteStandort, name])
        }
    }

    return (
        <aside className="sidebar">
            <section>
                <h2>Standorte</h2>
                {sortierteStandorte.map((name) => (
                    <div key={name}>
                        <label className="standort">
                            <input
                                type="checkbox"
                                checked={ausgewaehlteStandort.includes(name)}
                                onChange={() => umschalten(name)}
                            />
                            <span className="farbkreis" style={{ backgroundColor: farben[name] }} />
                            {name}
                        </label>
                    </div>
                ))}
            </section>

            <section>
                <h2>Karte</h2>
                {/* Karte */}
            </section>

            <section>
                <h2>Zeitraum</h2>
                <div className="zeitraum">
                    <h3>Jahr</h3>
                    <select value={jahr} onChange={(e) => aendereJahr(Number(e.target.value))}>
                        {jahre.map((j) => (
                            <option key={j} value={j}>{j}</option>
                        ))}
                    </select>

                    <h3>Monat</h3>
                    <select value={monat} onChange={(e) => setMonat(Number(e.target.value))}>
                        {monate.map((m) => (
                            <option key={m} value={m}>{MONATE[m - 1]}</option>
                        ))}
                    </select>
                </div>
            </section>

        </aside>
    );
}

export default Sidebar;
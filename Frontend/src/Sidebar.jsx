import { MONATE } from './konstante'

function Sidebar({
    standorte, farben, ausgewaehlterStandort, setAusgewaehlterStandort,
    jahr, monat, verfuegbar, aendereJahr, setMonat,
}) {
const jahre = [...new Set(verfuegbar.map((v) => v.jahr))]
const monate = verfuegbar.filter((v) => v.jahr === jahr).map((v) => v.monat)

    return (
        <aside className="sidebar">
            <section>
                <h2>Standorte</h2>
                {standorte.map((name) => (
                    <div key={name}>
                        <label className="standort">
                            <input
                                type="checkbox"
                                checked={name === ausgewaehlterStandort}
                                onChange={() => setAusgewaehlterStandort(name === ausgewaehlterStandort ? null : name)}
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
                <div>
                    <h3>Jahr</h3>
                    <select value={jahr} onChange={(e) => aendereJahr(Number(e.target.value))}>
                        {jahre.map((j) => (
                            <option key={j} value={j}>{j}</option>
                        ))}
                    </select>
                </div>

                <div>
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
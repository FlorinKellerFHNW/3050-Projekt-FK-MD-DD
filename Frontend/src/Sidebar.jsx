import { MONATE, STANDORT_REIHENFOLGE } from './konstante'
import { Button, Checkbox, FormControlLabel, Stack } from '@mui/material'
import Karte from './Karte'

function Sidebar({
    standorte, farben, ausgewaehlteStandorte, umschalten,
    jahr, monat, verfuegbar, aendereJahr, setMonat, zuruecksetzen, resetZaehler,
}) {
const jahre = [...new Set(verfuegbar.map((v) => v.jahr))]
const monate = verfuegbar.filter((v) => v.jahr === jahr).map((v) => v.monat)
const sortierteStandorte = [...standorte].sort(
    (a, b) => STANDORT_REIHENFOLGE.indexOf(a) - STANDORT_REIHENFOLGE.indexOf(b)
)

    return (
        <aside className="sidebar">
            <section>
                <h2>Standorte</h2>
                {sortierteStandorte.map((name) => (
                    <div key={name}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={ausgewaehlteStandorte.includes(name)}
                                    onChange={() => umschalten(name)}
                                />
                            }
                            label={
                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                    <span className="farbkreis" style={{ backgroundColor: farben[name] }} />
                                    <span>{name}</span>
                                </Stack>
                            }
                        />
                    </div>
                ))}
            </section>

            <section>
                <h2>Karte</h2>
                <Karte
                    key={resetZaehler}
                    farben={farben}
                    ausgewaehlteStandorte={ausgewaehlteStandorte}
                    umschalten={umschalten}
                />
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

            <section>
                <Button
                    variant="outlined"
                    onClick={zuruecksetzen}
                    sx={{
                        color: 'black',
                        borderColor: 'black',
                        borderWidth: 2,
                        fontSize: '1rem',
                        textTransform: 'none',
                        mt: '1.25rem',
                        '&:hover': {
                            borderColor: 'black',
                            borderWidth: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.06)',
                        },
                    }}
                >
                    Zurücksetzen
                </Button>
            </section>            

        </aside>
    );
}

export default Sidebar;
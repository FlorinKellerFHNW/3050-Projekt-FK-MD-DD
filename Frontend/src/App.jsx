import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { MainArea } from './MainArea'

import './App.css'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

const API = 'http://localhost:8000/api'

const STANDARD_JAHR = 2024
const STANDARD_MONAT = 1

export function App() {
  const [standorte, setStandorte] = useState([])
  const [farben, setFarben] = useState({})
  const [verfuegbar, setVerfuegbar] = useState([])
  const [ausgewaehlteStandorte, setAusgewaehlteStandorte] = useState([])
  const [jahr, setJahr] = useState(STANDARD_JAHR)
  const [monat, setMonat] = useState(STANDARD_MONAT)
  const [resetZaehler, setResetZaehler] = useState(0)


  useEffect(() => {
    fetch(`${API}/meta`)
    .then((res) =>{
      if (!res.ok) throw new Error(`Fehler ${res.status}`)
        return res.json()
    })
  .then((daten) => {
    setStandorte(daten.standorte)
    setAusgewaehlteStandorte(daten.standorte)
    setFarben(daten.farben)
    setVerfuegbar(daten.verfuegbar)
  })
  .catch((err) => console.error(`Meta konnte nicht geladen werden:`, err))
}, [])


  // Standort an- oder abwählen (für Checkboxen und Karte). Das alte Array wird nie verändert.
  const umschalten = (name) => {
    if (ausgewaehlteStandorte.includes(name)) {
      setAusgewaehlteStandorte(ausgewaehlteStandorte.filter((n) => n !== name))
    } else {
      setAusgewaehlteStandorte([...ausgewaehlteStandorte, name])
    }
  }

  const aendereJahr = (neuesJahr) => {
  setJahr(neuesJahr)
  const monate = verfuegbar.filter((v) => v.jahr === neuesJahr).map((v) => v.monat)
  if (!monate.includes(monat)) setMonat(monate[0])
}

const zuruecksetzen = () => {
  setAusgewaehlteStandorte(standorte)
  setJahr(STANDARD_JAHR)
  setMonat(STANDARD_MONAT)
  setResetZaehler(resetZaehler + 1)
}

  return (
    <div className="app">
      <Header />
      <Sidebar
        standorte={standorte}
        farben={farben}
        ausgewaehlteStandorte={ausgewaehlteStandorte}
        umschalten={umschalten}
        jahr={jahr}
        monat={monat}
        verfuegbar={verfuegbar}
        aendereJahr={aendereJahr}
        setMonat={setMonat}
        zuruecksetzen={zuruecksetzen}
        resetZaehler={resetZaehler}
      />
      <MainArea 
        jahr={jahr}
        monat={monat}
        setMonat={setMonat}
        ausgewaehlteStandorte={ausgewaehlteStandorte}
      />
      <Footer />

    </div>
  )
}

export default App


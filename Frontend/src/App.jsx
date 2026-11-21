import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { MainArea } from './MainArea'

import './App.css'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

const API = 'http://localhost:8000/api'


export function App() {
  const [standorte, setStandorte] = useState([])
  const [farben, setFarben] = useState({})
  const [verfuegbar, setVerfuegbar] = useState([])
  const [ausgewaehlteStandorte, setAusgewaehlteStandorte] = useState([])
  const [jahr, setJahr] = useState(2024)
  const [monat, setMonat] = useState(1)


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


  const aendereJahr = (neuesJahr) => {
  setJahr(neuesJahr)
  const monate = verfuegbar.filter((v) => v.jahr === neuesJahr).map((v) => v.monat)
  if (!monate.includes(monat)) setMonat(monate[0])
}


  return (
    <div className="app">
      <Header />
      <Sidebar
        standorte={standorte}
        farben={farben}
        ausgewaehlteStandorte={ausgewaehlteStandorte}
        setAusgewaehlteStandorte={setAusgewaehlteStandorte}
        jahr={jahr}
        monat={monat}
        verfuegbar={verfuegbar}
        aendereJahr={aendereJahr}
        setMonat={setMonat}
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


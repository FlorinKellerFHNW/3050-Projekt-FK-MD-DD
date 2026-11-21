import { useEffect, useState } from 'react'
import { Header } from './Header.jsx'
import { MainArea } from './MainArea.jsx'
import { Sidebar } from './Sidebar.jsx'
import { Footer } from './Footer.jsx'
import './App.css'

const API = 'http://localhost:8000/api'

export function App() {
  const [specBar, setSpecBar] = useState(null)
  const [monate, setMonate] = useState(null)
  const jahr = 2024

  useEffect(() => {
    fetch(`${API}/spec/bar`)
      .then((res) => res.json())
      .then((res) => setSpecBar(res))
      .catch((err) => console.error('Spec konnte nicht geladen werden:', err))
  }, [])

  useEffect(() => {
    fetch(`${API}/data/monate?jahr=${jahr}`)
      .then((res) => res.json())
      .then((res) => setMonate(res))
      .catch((err) => console.error('Daten konnten nicht geladen werden:', err))
  }, [jahr])

  return (
    <div className="app">
      <Header />
      <MainArea specBar={specBar} monate={monate} />
      <Sidebar />
      <Footer />
    </div>
  )
}

export default App


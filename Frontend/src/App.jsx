import { useEffect, useState } from 'react'

import './App.css'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

const API = 'http://localhost:8000/api'

export function App() {

  return (
    <div className="app">
      <Header />
      <Footer />

    </div>
  )
}

export default App


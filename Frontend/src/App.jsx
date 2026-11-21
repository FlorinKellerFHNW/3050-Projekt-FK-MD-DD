import { useEffect, useState } from 'react'
import { MainArea } from './MainArea'

import './App.css'

const API = 'http://localhost:8000/api'

export function App() {

  return (
    <div className="app">
      <MainArea />

    </div>
  )
}

export default App


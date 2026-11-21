import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { MainArea } from './MainArea'

import './App.css'

const API = 'http://localhost:8000/api'

export function App() {

  return (
    <div className="app">
      <Sidebar />
      <MainArea />

    </div>
  )
}

export default App


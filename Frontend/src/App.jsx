import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import './App.css'

const API = 'http://localhost:8000/api'

export function App() {

  return (
    <div className="app">
      <Sidebar />

    </div>
  )
}

export default App


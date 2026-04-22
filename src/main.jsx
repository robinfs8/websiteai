import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Waitlist from './pages/Waitlist.jsx'
import Generator from './pages/Generator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/generate" element={<Generator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

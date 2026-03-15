import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Determine backend URL based on environment
// For production (Vercel), you can set VITE_API_URL to your Render URL.
// For local development, it defaults to your local Express server.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

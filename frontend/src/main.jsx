import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Configure axios to use API URL from env in Render or fallback to localhost for local dev
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
axios.defaults.baseURL = apiUrl
axios.defaults.withCredentials = true

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

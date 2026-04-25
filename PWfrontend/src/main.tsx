// Desktop/Other/PersonalWebsite/PWfrontend/src/main.tsx
// Reece Williams

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css' // <-- Add this line
import './index.css' // Optional: keep for any custom global overrides

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
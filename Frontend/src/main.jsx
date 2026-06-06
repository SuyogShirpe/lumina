import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

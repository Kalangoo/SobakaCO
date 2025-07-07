// src/components/MapComponent.js

import React, { useState, useEffect } from 'react';
// Importe o NavigationControl para os botões de zoom (+/-)
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import PetDetail from './PetDetail';
import 'mapbox-gl/dist/mapbox-gl.css';

// Estilo para o nosso novo botão de geolocalização
const geolocateControlStyle = {
  right: 10,
  top: 10,
  padding: '10px',
  position: 'absolute'
};

function MapComponent() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: -46.6333, // Centralizado em São Paulo como padrão
    latitude: -23.5505,
    zoom: 9,
    width: '100vw',
    height: '90vh'
  });

  useEffect(() => {
    // ... seu código que busca os 'reports' continua igual
  }, []);

  // --- NOSSA NOVA FUNÇÃO ---
  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Sucesso! O navegador nos deu a localização.
          console.log('Localização encontrada:', position);
          setViewport({
            ...viewport, // Mantém a largura, altura, etc.
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            zoom: 14 // Aumenta o zoom para uma visão mais próxima
          });
        },
        (error) => {
          // Erro! O usuário pode ter bloqueado ou houve uma falha.
          console.error('Erro ao obter geolocalização:', error);
          alert(`Erro ao obter sua localização: ${error.message}`);
        }
      );
    } else {
      // O navegador não suporta geolocalização
      alert('Seu navegador não suporta geolocalização.');
    }
  };

  return (
    <Map
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    >
      {/* Botões de zoom padrão do Mapbox */}
      <NavigationControl position="top-left" />

      {/* --- NOSSO NOVO BOTÃO --- */}
      <div style={geolocateControlStyle}>
        <button onClick={handleGeolocate}>Onde Estou?</button>
      </div>

      {/* --- O resto do seu código de marcadores e popups continua igual --- */}
      {reports.map(report => (
        <Marker
          key={report.id}
          longitude={report.location.lng}
          latitude={report.location.lat}
        >
          <img 
            onClick={() => setSelectedReport(report)}
            // ...
          />
        </Marker>
      ))}
      {selectedReport && (
        <Popup
          // ...
        >
          <PetDetail report={selectedReport} />
        </Popup>
      )}
    </Map>
  );
}

export default MapComponent;
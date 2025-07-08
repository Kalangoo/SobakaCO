import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import PetDetail from './PetDetail';
import 'mapbox-gl/dist/mapbox-gl.css';

// Estilo para o botão de geolocalização (opcional, mas útil)
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
    longitude: -46.6333, 
    latitude: -23.5505,
    zoom: 9,
    width: '100vw',
    height: 'calc(100vh - 70px)' 
  });

  useEffect(() => {
    console.log("MapComponent montado. Tentando buscar dados...");

    const petReportsCollection = collection(db, 'petReports');

    const unsubscribe = onSnapshot(petReportsCollection, 
      (snapshot) => {
        const reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        console.log(`%c DADOS RECEBIDOS DO FIRESTORE: ${reportsData.length} relatórios encontrados.`, "color: green; font-weight: bold;");
        
        if (reportsData.length > 0) {
          console.log("Analisando o primeiro relatório:", reportsData[0]);
          console.log("Localização do primeiro relatório:", reportsData[0].location);
        }

        setReports(reportsData);
      },
      (error) => {
        console.error("%c !!! ERRO AO BUSCAR DADOS DO FIRESTORE !!!", "color: red; font-weight: bold;", error);
      }
    );

    return () => {
      console.log("MapComponent desmontado. Cancelando a inscrição do listener.");
      unsubscribe();
    };
  }, []); 

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewport({
          ...viewport,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          zoom: 14
        });
      });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Map
        {...viewport}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        <NavigationControl position="top-left" />

        <div style={geolocateControlStyle}>
          <button onClick={handleGeolocate}>Onde Estou?</button>
        </div>

        {reports.map(report => {
          console.log(`Tentando renderizar marcador para ${report.id}. Coordenadas:`, report.location);

          if (!report.location || typeof report.location.lat !== 'number' || typeof report.location.lng !== 'number') {
            console.warn(`Relatório ${report.id} foi pulado por não ter coordenadas válidas.`);
            return null; 
          }

          return (
            <Marker
              key={report.id}
              longitude={report.location.lng}
              latitude={report.location.lat}
            >
              <img 
                onClick={() => setSelectedReport(report)}
                src={report.status === 'Lost' 
                  ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' 
                  : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                } 
                alt="Marcador de localização de pet"
                style={{cursor: 'pointer', width: '32px', height: '32px'}}
              />
            </Marker>
          );
        })}


        {selectedReport && (
          <Popup
            longitude={selectedReport.location.lng}
            latitude={selectedReport.location.lat}
            onClose={() => setSelectedReport(null)}
            anchor="left"
          >
            <PetDetail report={selectedReport} />
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default MapComponent;
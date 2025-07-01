import React, { useState, useEffect } from 'react';
// V6 SYNTAX: 'Map' is a default import, the others are named imports.
import Map, { Marker, Popup } from 'react-map-gl'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import PetDetail from './PetDetail';
import 'mapbox-gl/dist/mapbox-gl.css';

// In v6, the component is a class, so we manage the viewport in state.
function MapComponent() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: -74.0060,
    latitude: 40.7128,
    zoom: 9,
    width: '100vw',
    height: '90vh'
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'petReports'), (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(reportsData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Map
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} // Note: prop name is slightly different in v6
    >
      {reports.map(report => (
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
            alt="Pet location marker"
            style={{cursor: 'pointer'}}
          />
        </Marker>
      ))}
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
  );
}
export default MapComponent;
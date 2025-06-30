import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import PetDetail from './PetDetail'; // We will create this next

const mapContainerStyle = {
  width: '100vw',
  height: '90vh',
};

const center = {
  lat: 40.7128, // Default center (e.g., New York City)
  lng: -74.0060,
};

function MapComponent() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    // Real-time listener for pet reports
    const unsubscribe = onSnapshot(collection(db, 'petReports'), (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(reportsData);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={10}
    >
      {reports.map(report => (
        <MarkerF
          key={report.id}
          position={{ lat: report.location.lat, lng: report.location.lng }}
          onClick={() => setSelectedReport(report)}
          icon={{
            url: report.status === 'Lost' 
                 ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' 
                 : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          }}
        />
      ))}

      {selectedReport && (
        <InfoWindowF
          position={{ lat: selectedReport.location.lat, lng: selectedReport.location.lng }}
          onCloseClick={() => setSelectedReport(null)}
        >
          <PetDetail report={selectedReport} />
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}

export default MapComponent;
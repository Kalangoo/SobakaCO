import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebaseConfig';
// V6 SYNTAX: 'Map' is a default import
import Map, { Marker } from 'react-map-gl';
import GeocoderControl from './GeocoderControl';

function ReportForm({ onClose }) {
  const [formData, setFormData] = useState({
    status: 'Lost', name: '', breed: '', features: '', hasInjuries: 'No', lastSeenTime: '',
  });
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: -98.5795, latitude: 39.8283, zoom: 3,
  });

  const handleChange = (e) => { /* ... same as before ... */ };
  const handleImageChange = (e) => { /* ... same as before ... */ };
  
  const handleGeocoderResult = (result) => {
    if (result) {
      const [lng, lat] = result.center;
      setLocation({ address: result.place_name, lat: lat, lng: lng });
      setViewport({ ...viewport, longitude: lng, latitude: lat, zoom: 14 });
    } else {
      setLocation(null);
    }
  };

  const handleSubmit = async (e) => { /* ... same as before ... */ };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Report a Pet</h2>
        <form onSubmit={handleSubmit}>
          {/* ... Your other form fields ... */}
          <input type="file" onChange={handleImageChange} required />
          <p>último local visto:</p>
          <div style={{ fontFamily: 'sans-serif', height: '250px', position: 'relative' }}>
              <Map
                  {...viewport}
                  width="100%"
                  height="100%"
                  onViewportChange={nextViewport => setViewport(nextViewport)}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              >
                  <GeocoderControl mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} position="top-left" onResult={handleGeocoderResult} />
                  {location && <Marker longitude={location.lng} latitude={location.lat} />}
              </Map>
          </div>
          {location && <p><strong>Selected:</strong> {location.address}</p>}
          <br/>
          <button type="submit">Reportar</button>
          <button type="button" onClick={onClose}>Fechar</button>
        </form>
      </div>
    </div>
  );
}
// You'll need to copy back your handleChange, handleImageChange, and handleSubmit functions
// Or just replace the import and the <Map> component in your existing file.
export default ReportForm;
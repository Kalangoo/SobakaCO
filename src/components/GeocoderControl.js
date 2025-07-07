import React, { useState } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// CORRECTED IMPORT: We are now using the internal hook from v6
import { _useMapControl as useControl } from 'react-map-gl'; 
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// By importing '_useMapControl as useControl', the rest of the component
// code doesn't need to change. This is a clean way to handle version differences.
const GeocoderControl = (props) => {
  const [marker, setMarker] = useState(null);

  // This 'useControl' is now correctly aliased to the '_useMapControl' that exists in v6
  const geocoder = useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        marker: false,
        accessToken: props.mapboxApiAccessToken, // Using the correct prop name for v6
      });
      ctrl.on('result', (evt) => {
        props.onResult(evt.result);
      });
      ctrl.on('clear', () => {
        props.onResult(null);
      });
      return ctrl;
    },
    {
      position: props.position
    }
  );

  return marker;
};



export default GeocoderControl;
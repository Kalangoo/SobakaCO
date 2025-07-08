import React, { useState } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { _useMapControl as useControl } from 'react-map-gl'; 
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


const GeocoderControl = (props) => {
  const [marker, setMarker] = useState(null);

  const geocoder = useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        marker: false,
        accessToken: props.mapboxApiAccessToken, 
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
import { useContext } from "react";
import { Context } from '../context/Context';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { formatRelative } from 'date-fns';

import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
// import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@react/combobox';
// import '@reach/combobox/styles.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
}
const center = {
  lat: 52.524, 
  lng: 13.410
}

const Eintragen = () => {
  const {
    mapState
  } = useContext(Context);
  
  const options = {
    styles: mapState,
  }
  
  
  const {isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  if (loadError) return <div>"Error loading maps"</div>;
  if (!isLoaded) return <div>"Loading Maps"</div>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Google Maps Integration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <GoogleMap 
          mapContainerStyle={mapContainerStyle} 
          zoom={11} 
          center={center}
          options={options}
        ></GoogleMap>
      </IonContent>
    </IonPage>
  );
};

export default Eintragen;

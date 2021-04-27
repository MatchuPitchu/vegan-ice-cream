import { useContext, useState, useRef, useCallback } from "react";
import { Context } from '../context/Context';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
// import { formatRelative } from 'date-fns';
import Search from '../components/Search';

const Eintragen = () => {
  const { mapState } = useContext(Context);
  const [center, setCenter] = useState({ lat: 52.524, lng: 13.410 })
  const [markers, setMarkers] = useState([
    { lat: 52.524, lng: 13.410, id: 1 },
    { lat: 52.424, lng: 13.310, id: 2 }
  ]);
  const [selected, setSelected] = useState(null);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const options = {
    styles: mapState,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
    },
    gestureHandling: "cooperative",
    minZoom: 9,
    // boundaries of germany
    restriction: {
      latLngBounds: {
        north: 55.1,
        south: 47.1,
        west: 5.8,
        east: 15.1,
      },
    },
  }
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

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
        <Search />
          <GoogleMap 
            mapContainerClassName="mapContainer" 
            zoom={11} 
            center={center}
            options={options}
            onLoad={onMapLoad}
          >
            {markers.map((marker) => (
              <Marker 
                key={marker.id}
                position={{lat: marker.lat, lng: marker.lng}} 
                icon={{
                  url: './assets/icons/ice-cream-filled-ionicons.svg',
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
                // label="test"
                // title="test rollover text"
                onClick={() => setSelected(marker)}
              />
            ))}

            {selected ? (
              <InfoWindow position={{lat: selected.lat, lng: selected.lng}} onCloseClick={() => setSelected(null)} >
                <div style={{backgroundColor: "black"}}>
                  <h2></h2>
                  <p>Lat: {selected.lat} Lng: {selected.lng}</p>
                </div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
      </IonContent>
    </IonPage>
  );
};

export default Eintragen;

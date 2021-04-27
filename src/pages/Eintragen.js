import { useContext, useState, useCallback } from "react";
import { Context } from '../context/Context';
import { IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import ReactDOMServer from 'react-dom/server';
import { iceCream } from "ionicons/icons";
// import { formatRelative } from 'date-fns';
// import Search from '../components/Search';

const Eintragen = () => {
  const { mapStyles } = useContext(Context);
  const [map, setMap]= useState(null);
  const [center, setCenter] = useState({ lat: 52.524, lng: 13.410 })
  const [markers, setMarkers] = useState([
    { lat: 52.524, lng: 13.410, id: 1 },
    { lat: 52.424, lng: 13.310, id: 2 }
  ]);
  const [selected, setSelected] = useState(null);

  // insert icon
  const iconHTML = ReactDOMServer.renderToString(<IonIcon icon={iceCream} />)
 
  console.log(iconHTML)

  // const onMapLoad = (map) => {
  //   const bounds = new window.google.maps.latLngBounds();
  //   map.fitBounds(bounds);
  // }

  const onMapLoad = useCallback((map) => {
    setMap(map)
  }, []);

  console.log(map)

  const options = {
    styles: mapStyles,
    disableDefaultUI: false
    ,
    zoomControlOptions: {
      position: window.google.maps.ControlPosition.TOP_LEFT,
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
  
  console.log(window.google.maps);

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

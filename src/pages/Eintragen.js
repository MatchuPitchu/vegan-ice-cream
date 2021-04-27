import { useContext, useState, useCallback } from "react";
import { Context } from '../context/Context';
import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import ReactDOMServer from 'react-dom/server';
import { addCircleOutline, iceCream, removeCircleOutline } from "ionicons/icons";
// import { formatRelative } from 'date-fns';
// import Search from '../components/Search';
import Leaflet from "leaflet";



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
  const icon = new Leaflet.DivIcon({
    html: iconHTML,
  });

  console.log(iconHTML)

  const onMapLoad = useCallback((map) => {
    setMap(map);
    initZoomControl(map);
  }, []);

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: false,
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

  // Add customs zoom control https://developers.google.com/maps/documentation/javascript/examples/control-replacement#maps_control_replacement-javascript
  const initZoomControl = (map) => {
    document.querySelector(".zoom-control-in").onclick = () => {
      map.setZoom(map.getZoom() + 1);
    };
    document.querySelector(".zoom-control-out").onclick = () => {
      map.setZoom(map.getZoom() - 1);
    };
    map.controls[window.google.maps.ControlPosition.TOP].push(
      document.querySelector(".zoom-control")
    );
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
        <div className="zoom-control">
          <IonButton className="zoom-control-in zoomIcons" title="Zoom In" fill="clear" >
            <IonIcon icon={addCircleOutline} />
          </IonButton>
          <IonButton className="zoom-control-out zoomIcons" title="Zoom Out" fill="clear">
            <IonIcon icon={removeCircleOutline} />
          </IonButton>
        </div>

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

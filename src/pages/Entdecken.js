import { useContext, useState, useCallback } from "react";
import { Context } from '../context/Context';
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { addCircleOutline, closeCircleOutline, refreshCircle, removeCircleOutline } from "ionicons/icons";
import Spinner from "../components/Spinner";
// import { formatRelative } from 'date-fns';

const Entdecken = () => {
  const { toggle, mapStyles, enterAnimation, leaveAnimation, showModal, setShowModal } = useContext(Context);
  const [map, setMap]= useState(null);
  const [center, setCenter] = useState({ lat:  52.524, lng: 13.410 })
  const [markers, setMarkers] = useState([
    { lat: 52.524, lng: 13.410, id: 1 },
    { lat: 52.424, lng: 13.310, id: 2 }
  ]);
  const [selected, setSelected] = useState(null);

  const onMapLoad = useCallback((map) => {
    setMap(map);
    initZoomControl(map);
  }, []);

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    gestureHandling: "cooperative",
    minZoom: 9,
    // restricted to boundaries of germany
    restriction: {
      latLngBounds: {
        north: 55.1,
        south: 47.1,
        west: 5.8,
        east: 15.1,
      },
    },
  }

  const initZoomControl = (map) => {
    // Add customs zoom control https://developers.google.com/maps/documentation/javascript/examples/control-replacement#maps_control_replacement-javascript
    document.querySelector(".zoom-control-in").onclick = () => {
      map.setZoom(map.getZoom() + 1);
    };
    document.querySelector(".zoom-control-out").onclick = () => {
      map.setZoom(map.getZoom() - 1);
    };
    // Add custom center control https://developers.google.com/maps/documentation/javascript/examples/control-custom
    const controlDiv = document.querySelector(".center-control");
    controlDiv.addEventListener('click', () => map.setCenter(center));
    
    map.controls[window.google.maps.ControlPosition.TOP].push(
      document.querySelector(".control")
    );
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  })

  if (loadError) return <div>"Error loading maps"</div>;

  return (isLoaded) ? (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent fullscreen>
        <div className="control">
          <IonButton className="zoom-control-in zoomIcons" fill="clear" >
            <IonIcon icon={addCircleOutline} />
          </IonButton>
          <IonButton className="zoom-control-out zoomIcons" fill="clear">
            <IonIcon icon={removeCircleOutline} />
          </IonButton>
          <IonButton className="center-control" title="Karte auf Anfangspunkt zentrieren" fill="clear" >
            <IonIcon icon={refreshCircle} />
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
                url: './assets/icons/ice-cream-filled-fontawesome.svg',
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              title="TEST TEST TEST rollover text"
              onClick={() => { setSelected(marker); setShowModal(true) }}
            />
          ))}
          {selected ? (
            <div className="modalContainer">
              <IonModal cssClass='mapModal' isOpen={showModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                <IonItem>
                  <IonLabel>
                    Lat: {selected.lat} Lng: {selected.lng}
                  </IonLabel>
                  <IonButton fill="clear" onClick={() => setShowModal(false)}><IonIcon icon={closeCircleOutline }/></IonButton>
                </IonItem>
              </IonModal>
            </div>
          ) : null}
        </GoogleMap>
      </IonContent>
    </IonPage>
  ) : <Spinner /> ;
};

export default Entdecken;

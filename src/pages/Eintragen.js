import { useContext, useState, useCallback } from "react";
import { Context } from '../context/Context';
import { createAnimation, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { addCircleOutline, closeCircle, closeCircleOutline, removeCircleOutline } from "ionicons/icons";
// import { formatRelative } from 'date-fns';

const Eintragen = () => {
  const { mapStyles, enterAnimationBtm, leaveAnimationBtm } = useContext(Context);
  const [map, setMap]= useState(null);
  const [center, setCenter] = useState({ lat: 52.524, lng: 13.410 })
  const [markers, setMarkers] = useState([
    { lat: 52.524, lng: 13.410, id: 1 },
    { lat: 52.424, lng: 13.310, id: 2 }
  ]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  // // animations modal
  // const enterAnimation = (modal) => {
  //   // darkened background 
  //   const backdropAnimation = createAnimation()
  //     .addElement(modal.querySelector('ion-backdrop'))
  //     .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

  //   // animates modal
  //   const wrapperAnimation = createAnimation()
  //     .addElement(modal.querySelector('.modal-wrapper'))
  //     .keyframes([
  //       { offset: 0, opacity: '1', transform: 'translateX(200px)' },
  //       { offset: 1, opacity: '1', transform: 'translate(0px)' },
  //     ]);

  //   return createAnimation()
  //     .addElement(modal)
  //     .easing('ease-out')
  //     .duration(200)
  //     .addAnimation([backdropAnimation, wrapperAnimation]);
  // }

  // const leaveAnimation = (modal) => {
  //   return enterAnimation(modal).direction('reverse');
  // }

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
                url: './assets/icons/ice-cream-filled-fontawesome.svg',
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              title="TEST TEST TEST rollover text"
              onClick={() => { setSelected(marker); setShowModal(true) }}
            />
          ))}

          {selected ? (
            <IonModal cssClass='mapModal' isOpen={showModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowModal(false)} enterAnimation={enterAnimationBtm} leaveAnimation={leaveAnimationBtm}>
              <IonItem>
                <IonLabel>
                  Lat: {selected.lat} Lng: {selected.lng}
                </IonLabel>
                <IonButton fill="clear" onClick={() => setShowModal(false)}><IonIcon icon={closeCircleOutline }/></IonButton>
              </IonItem>
            </IonModal>
          ) : null}

        </GoogleMap>
      </IonContent>
    </IonPage>
  );
};

export default Eintragen;

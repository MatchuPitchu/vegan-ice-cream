import { useContext, useState, useCallback } from "react";
import { Context } from '../context/Context';
import ReactStars from "react-rating-stars-component";
import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonModal, IonPage, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { addCircleOutline, closeCircleOutline, listCircle, map as mapIcon, planet, refreshCircle, removeCircleOutline } from "ionicons/icons";
import Spinner from "../components/Spinner";

const Entdecken = () => {
  const { user, locations, disableInfScroll, loadMore, toggle, mapStyles, enterAnimation, leaveAnimation, showModal, setShowModal } = useContext(Context);
  const [map, setMap]= useState(null);
  const [center, setCenter] = useState({ lat:  52.524, lng: 13.410 })
  const [markers, setMarkers] = useState([
    { lat: 52.524, lng: 13.410, id: 1 },
    { lat: 52.424, lng: 13.310, id: 2 }
  ]);
  const [selected, setSelected] = useState(null);
  const [segment, setSegment] = useState('list');

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
    // libraries: ['places']
  })

  if (loadError) return <div>"Error loading maps"</div>;

  return (isLoaded) ? (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
        <IonToolbar className="toolbarTransparent">
          <IonSegment onIonChange={(e) => setSegment(e.detail.value)} value={segment}>
            <IonSegmentButton value='map' layout="icon-start">
              <IonLabel>Karte</IonLabel>
              <IonIcon icon={mapIcon} />
            </IonSegmentButton>
            <IonSegmentButton value='list' layout="icon-start">
              <IonLabel>Liste</IonLabel>
              <IonIcon icon={listCircle} />
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

        {segment === 'map' && (
          <IonContent>
            <div className="control">
              <div className="d-flex flex-column">
                <IonButton className="zoom-control-in zoomIcons" fill="clear" >
                  <IonIcon icon={addCircleOutline} />
                </IonButton>
                <IonButton className="zoom-control-out zoomIcons" fill="clear">
                  <IonIcon icon={removeCircleOutline} />
                </IonButton>
              </div>
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
        )}

      {segment === 'list' && (
        <IonContent>
          {locations && locations.map((loc, i) => (
            <IonCard key={i} >
              <IonItem lines="full">
                <IonAvatar slot='start'>
                  <img src='./assets/icons/ice-cream-icon-dark.svg' />
                </IonAvatar>
                <IonLabel >
                  {loc.name}
                  <p>{loc.address.street} {loc.address.number}</p>
                  <p className="mb-2">{loc.address.zipcode} {loc.address.city}</p>
                  <p><a href={loc.location_url}>Webseite</a></p>
                </IonLabel>
              </IonItem>
              
              <IonCardContent>
                <IonCardSubtitle color='primary'>Bewertungen</IonCardSubtitle>
                <p></p>
                <div className="d-flex align-items-center">
                  <div className="me-2">Qualität</div>
                  <div>
                    <ReactStars
                      count={5}
                      value={loc.location_rating_quality}
                      edit={false}
                      size={18}
                      color='#9b9b9b'
                      activeColor='#de9c01'
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2">Veganes Angebot</div>
                  <div>
                    <ReactStars 
                      count={5}
                      value={loc.location_rating_vegan_offer}
                      edit={false}
                      size={18}
                      color='#9b9b9b'
                      activeColor='#de9c01'
                    />
                  </div>
                </div>
                <p className="p-weak">Location ID: {loc._id}</p>
                    
              </IonCardContent>
            </IonCard>
          ))}
          {/* Infinite Scroll Ionic React: https://dev.to/daviddalbusco/infinite-scroll-with-ionic-react-3a3i */}
          <IonInfiniteScroll threshold="25%" disabled={disableInfScroll} onIonInfinite={(e) => loadMore(e)}>
            <IonInfiniteScrollContent loadingSpinner="dots" loadingText="Loading more locations ...">
            </IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      )}

    </IonPage>
  ) : <Spinner /> ;
};

export default Entdecken;

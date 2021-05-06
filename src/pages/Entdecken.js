import { useContext, useState, useCallback, useRef } from "react";
import { Context } from '../context/Context';
import ReactStars from "react-rating-stars-component";
import { Geolocation } from '@ionic-native/geolocation';
import { Controller, useForm } from 'react-hook-form';
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonToast, IonToggle, IonToolbar } from '@ionic/react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { add, addCircleOutline, closeCircleOutline, listCircle, location as myPos, mailUnread, map as mapIcon, refreshCircle, removeCircleOutline } from "ionicons/icons";
import Spinner from "../components/Spinner";

const defaultValues = { 
  address: '', 
}

const Entdecken = () => {
  const { searchText, setSearchText, loading, setLoading, setError, error, user, locations, disableInfScroll, loadMore, all, setAll, toggle, mapStyles, enterAnimation, leaveAnimation, showMapModal, setShowMapModal  } = useContext(Context);
  const [center, setCenter] = useState({ lat:  52.524, lng: 13.410 });
  
  const [map, setMap]= useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [selected, setSelected] = useState(null);
  const [segment, setSegment] = useState('map');
  const [position, setPosition] = useState();
  const [newLocation, setNewLocation] = useState();
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({defaultValues});
  const contentRef = useRef(null);

  const getLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
    } catch (error) {
      setError('Deine Position kann nicht ermittelt werden. Kontrolliere deine Einstellungen:', error)
    }
  };

  const scrollToAdd = () => {
    contentRef.current && contentRef.current.scrollToBottom(500);
  };

  const onSubmit = (data) => {
    geocoder.geocode( { 
      'address': data.address, 
      bounds: {
        north: 55.1,
        south: 47.1,
        west: 5.8,
        east: 15.1,
      },
      region: 'de',
      componentRestrictions: {
        country: 'DE'
      }
    }, function (results, status) {
      if(status == 'OK') {
        console.log(results[0]);
      } else {
        setError('Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Ort in Deutschland eintragen.')
      }
    });
    console.log(data);
    setSearchText(data);
    // reset(defaultValues);
  };

  const onMapLoad = useCallback((map) => {
    console.log(map);
    setMap(map);
    initControl(map);
    setGeocoder(new window.google.maps.Geocoder);
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

  const initControl = (map) => {
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

    // const GoogleAutocomplete = new map.places.AutocompleteService();
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // libraries: ['places']
  })

  if (loadError) return <IonPage>Beim Laden der Karte ist ein Fehler aufgetreten. Bitte versuche es später nochmal.</IonPage>;

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
        <IonContent ref={contentRef} scrollEvents>
 
          <div className="control">
            <div className="d-flex flex-column">
              <IonButton className="zoom-control-in zoomIcons" fill="clear" >
                <IonIcon icon={addCircleOutline} />
              </IonButton>
              <IonButton className="zoom-control-out zoomIcons" fill="clear">
                <IonIcon icon={removeCircleOutline} />
              </IonButton>
            </div>
            <div className="d-flex flex-column align-items-end">
              <IonButton className="all-control" title="Mehr Eisläden laden" >
                <IonLabel className="me-1">Alle anzeigen</IonLabel>
                <IonToggle onIonChange={e => setAll(prev => !prev)} checked={all} disabled={`${all ? 'true' : 'false'}`} />
              </IonButton>
              <IonButton className="add-control" onClick={scrollToAdd} title="Neue Adresse hinzufügen">
                <IonIcon icon={add} />
              </IonButton>
              <IonButton className="where-control" onClick={getLocation} title="Mein Standort">
                <IonIcon icon={myPos} />
              </IonButton>
              <IonButton className="center-control" title="Karte auf Anfangspunkt zentrieren" >
                <IonIcon icon={refreshCircle} />
              </IonButton>
            </div>
          </div>

          <GoogleMap 
            mapContainerClassName="mapContainer" 
            zoom={11} 
            center={center}
            options={options}
            onLoad={onMapLoad}
          >
            {locations && locations.map((loc) => (
              <Marker 
                key={loc._id}
                position={{lat: loc.address.geo.lat, lng: loc.address.geo.lng}} 
                icon={{
                  url: './assets/icons/ice-cream-icon-dark.svg',
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
                title={`${loc.name}, ${loc.address.street} ${loc.address.number}`}
                onClick={() => { setSelected(loc); setShowMapModal(true) }}
              />
            ))}
            {selected ? (
              <div className="modalContainer">
                <IonModal cssClass='mapModal' isOpen={showMapModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowMapModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                  <IonItem>
                    <IonLabel>
                      Lat: {selected.lat} Lng: {selected.lng}
                    </IonLabel>
                    <IonButton fill="clear" onClick={() => setShowMapModal(false)}><IonIcon icon={closeCircleOutline }/></IonButton>
                  </IonItem>
                </IonModal>
              </div>
            ) : null}
            {position && (
              <Marker
                position={{lat: position.lat, lng: position.lng}}
                icon={{
                  url: './assets/icons/current-position-marker.svg',
                  scaledSize: new window.google.maps.Size(15, 15),
                }}
              />
            )}
          </GoogleMap>
          <form className="row" onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines="none" className="mb-1">
              {/* <IonLabel position='floating' htmlFor="address">Adresse</IonLabel> */}
              <Controller
                  control={control}
                  render={({ 
                    field: { onChange, value },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <IonSearchbar className="searchbar" type="search" inputmode="text" value={value} autocomplete='street-address' onIonChange={e => onChange(e.detail.value)} placeholder="Neue Adresse hinzufügen" searchIcon={add} showCancelButton="always"	cancel-button-text="" />
                    // <IonInput inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                  )}
                  name="address"
                  errors="test"
                  rules={{ required: true }}
                />
            </IonItem>
            {/* {showError("name", errors)} */}
          </form>
        </IonContent>
      )}

      {segment === 'list' && (
        <IonContent>
          {locations && locations.map((loc) => (
            <IonCard key={loc._id} >
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
      <IonLoading 
        isOpen={loading} 
        message={"Deine Position wird ermittelt ..."}
        onDidDismiss={() => setLoading(false)}
      />
      <IonToast 
        isOpen={error ? true : false} 
        message={error} 
        onDidDismiss={() => setError('')}
        duration={6000} 
      />
    </IonPage>
  ) : <Spinner /> ;
};

export default Entdecken;

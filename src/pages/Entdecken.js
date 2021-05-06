import { useContext, useState, useCallback, useRef } from "react";
import { Context } from '../context/Context';
import ReactStars from "react-rating-stars-component";
import { Geolocation } from '@ionic-native/geolocation';
import { Controller, useForm } from 'react-hook-form';
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonToast, IonToggle, IonToolbar } from '@ionic/react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { add, addCircleOutline, closeCircleOutline, listCircle, location as myPos, mailUnread, map as mapIcon, refreshCircle, removeCircleOutline } from "ionicons/icons";
import Spinner from "../components/Spinner";
import NewLocationForm from "../components/NewLocationForm";

const defaultValues = { 
  address: '', 
}

const Entdecken = () => {
  const { 
    searchText, setSearchText, 
    loading, setLoading, 
    error, setError, 
    user, 
    locations, 
    disableInfScroll, 
    position, setPosition,
    newLocation, setNewLocation,
    loadMore, 
    all, setAll, 
    toggle, 
    mapStyles, 
    enterAnimation, leaveAnimation, 
    showMapModal, setShowMapModal, 
    showNewLocModal, setShowNewLocModal  
  } = useContext(Context);
  const [center, setCenter] = useState({ lat:  52.524, lng: 13.410 });
  
  const [map, setMap]= useState(null);
  const [selected, setSelected] = useState(null);
  const [segment, setSegment] = useState('map');
  
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
    // (number) means duration
    contentRef.current && contentRef.current.scrollToBottom(500);
  };

  const onSubmit = (data) => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(data.address)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const { results } = await res.json();
        console.log(results)
        setNewLocation({
          name: '',
          address: {
            street: results[0].address_components[1] ? results[0].address_components[1].long_name : '',
            number: results[0].address_components[0] ? results[0].address_components[0].long_name : '',
            zipcode: results[0].address_components[7] ? results[0].address_components[7].long_name : '',
            city: results[0].address_components[3] ? results[0].address_components[3].long_name : '',
            country: results[0].address_components[6] ? results[0].address_components[6].long_name : '',
            geo: {
              lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
              lng: results[0].geometry.location ? results[0].geometry.location.lng : null
            }
          },
          location_url: '',
          place_id: results[0].place_id ? results[0].place_id : ''
        })
        if(results[0].geometry.location) {
          setCenter({
            lat: results[0].geometry.location.lat,
            lng: results[0].geometry.location.lng
          });
          contentRef.current.scrollToTop(500);
        }
      } catch (error) {
        setError('Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in Deutschland eintragen.')
      }
    };
    fetchData();
    setLoading(false);
    // reset(defaultValues);
  };

  console.log(newLocation);

  const onMapLoad = useCallback((map) => {
    console.log(map);
    setMap(map);
    initControl(map);
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

            {position && (
              <Marker
                position={{lat: position.lat, lng: position.lng}}
                icon={{
                  url: './assets/icons/current-position-marker.svg',
                  scaledSize: new window.google.maps.Size(15, 15),
                }}
              />
              )}

            {newLocation && newLocation.address.geo.lat && (
              <Marker
                position={{lat: newLocation.address.geo.lat, lng: newLocation.address.geo.lng}}
                icon={{
                  url: './assets/icons/newLocation-marker.svg',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                title={`${newLocation.address.street} ${newLocation.address.number}, ${newLocation.address.zipcode} ${newLocation.address.city}`}
                onClick={() => { setSelected(newLocation); setShowNewLocModal(true) }}
              />
            )}

            {selected ? (
              <div>
                <IonModal cssClass='mapModal' isOpen={showMapModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowMapModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                  <IonItem>
                    <IonLabel>
                      Lat: {selected.address.geo.lat} Lng: {selected.address.geo.lng}
                    </IonLabel>
                    <IonButton fill="clear" onClick={() => setShowMapModal(false)}><IonIcon icon={closeCircleOutline }/></IonButton>
                  </IonItem>
                </IonModal>

                <IonModal cssClass='newLocModal' isOpen={showNewLocModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowNewLocModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                  <IonItem>
                    <IonLabel>Eisladen eintragen</IonLabel>
                    <IonButton fill="clear" onClick={() => setShowNewLocModal(false)}><IonIcon icon={closeCircleOutline }/></IonButton>
                  </IonItem>
                  <NewLocationForm />
                </IonModal>
              </div>
            ) : null}

          </GoogleMap>

          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines="none" className="mb-1 d-flex flex-column align-items-center">
              <IonLabel className="ion-text-wrap mb-2" position='stacked' htmlFor="address">Tippe den Namen des Eisladens und der Stadt ein. Wenn das nicht funktioniert, trage die korrekte Adresse ein.</IonLabel>
              <Controller
                control={control}
                render={({ 
                  field: { onChange, value },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonInput color="primary" type="search" inputmode="text" value={value} autocomplete='street-address' onIonChange={e => onChange(e.detail.value)} placeholder="Name, Adresse ..." searchIcon={add} showCancelButton="always"	cancel-button-text="" />
                )}
                name="address"
                rules={{ required: true }}
              />
              <IonButton fill="solid" className="check-btn mb-2" type="submit">
                <IonIcon icon={add} />Check: Erscheint ein grünes Icon? Klicke drauf.
              </IonButton>
            </IonItem>
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
        isOpen={loading ? true : false} 
        message={"Einen Moment bitte ..."}
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

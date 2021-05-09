import { useContext, useState, useCallback, useRef } from "react";
import { Context } from '../context/Context';
import { Geolocation } from '@ionic-native/geolocation';
import { Controller, useForm } from 'react-hook-form';
import { IonItem, IonButton, IonContent, IonHeader, IonIcon, IonLabel, IonList, IonLoading, IonModal, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonToast, IonToggle, IonToolbar, IonAvatar, IonAlert, IonBadge } from '@ionic/react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { add, addCircleOutline, bookmarks, bookmarksOutline, closeCircleOutline, listCircle, location as myPos, map as mapIcon, refreshCircle, removeCircleOutline } from "ionicons/icons";
import NewLocationForm from "../components/NewLocationForm";
import SelectedMarker from '../components/SelectedMarker';
import ListMap from "../components/ListMap";
import Spinner from "../components/Spinner";

const defaultValues = { 
  address: '', 
}

const Entdecken = () => {
  const {
    loading, setLoading, 
    error, setError,
    user, 
    locations,
    map, setMap,
    selected, setSelected,
    position, setPosition,
    newLocation, setNewLocation,
    all, setAll, 
    mapStyles, 
    enterAnimation, leaveAnimation, 
    showMapModal, setShowMapModal, 
    showNewLocModal, setShowNewLocModal,
    bookmark, setBookmark,
    alertUpdateFav, setAlertUpdateFav,
    addFavLoc,
    removeFavLoc
  } = useContext(Context);
  const [libraries] = useState(['places']);
  const [center, setCenter] = useState({ lat:  52.524, lng: 13.410 });

  const [segment, setSegment] = useState('map');
  const [autocomplete, setAutocomplete] = useState(null);
  const [predict, setPredict] = useState([]);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({defaultValues});
  const contentRef = useRef(null);
  const markerRef = useRef(null);

  const getLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
    } catch (error) {
      setError('Deine Position kann nicht ermittelt werden. Kontrolliere deine Einstellungen:', error)
    }
  };

  const onSubmit = (data) => {
    setLoading(true);
    setAll(true);
    setPredict([]);
    const fetchData = async () => {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(data.address)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const { results } = await res.json();
        console.log('Fetching data Google API:', results)
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
    reset(defaultValues);
  };

  const checkDuplicate = () => {
    const duplicate = locations.find(loc => loc.address.geo.lat === newLocation.address.geo.lat)
    console.log(duplicate)
    if(duplicate) {
      setError('Diese Adresse gibt es schon.');
      setNewLocation({})
    }
    if(!duplicate) {
      setSelected(newLocation); 
      setShowNewLocModal(true); 
    }
  }

  const scrollDown = () => {
    // (number) means duration
    contentRef.current && contentRef.current.scrollToBottom(500);
  };

  // Debounce Autocomplete functions
  const debounce = (func, timeout = 2000) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args)}, timeout);
    };
  }
  
  const forAutocompleteChange = debounce((value) => {
    if(value) {
      autocomplete.getPlacePredictions({
        input: value,
        componentRestrictions: { country: 'de' },
        // types: ["establishment"]
      }, function (predictions, status) {
        if(status != 'OK') setError('Ups, das hat nicht funktioniert.')
        setPredict(predictions);
      });
    }
  });

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

  const onMapLoad = useCallback((map) => {
    setMap(map);
    initControl(map);
    const autocompleteService = new window.google.maps.places.AutocompleteService()
    setAutocomplete(autocompleteService);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  return (isLoaded) ? (
    <IonPage>
      <IonHeader>
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
                <IonToggle onIonChange={e => setAll(true)} checked={all} disabled={`${all ? 'true' : 'false'}`} />
              </IonButton>
              <IonButton className="add-control" onClick={scrollDown} title="Neue Adresse hinzufügen">
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
            onUnmount={onUnmount}
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
                  scaledSize: new window.google.maps.Size(60, 60),
                }}
              />
              )}

            {newLocation ? (
              <Marker
                ref={markerRef}
                position={{lat: newLocation.address.geo.lat, lng: newLocation.address.geo.lng}}
                icon={{
                  url: './assets/icons/newLocation-marker.svg',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                optimized={false}
                zIndex={1}
                title={`${newLocation.address.street} ${newLocation.address.number}, ${newLocation.address.zipcode} ${newLocation.address.city}`}
                onClick={() => checkDuplicate()}
              />
            ) : null }

            {selected ? (
              <div>
                <IonModal cssClass='mapModal' isOpen={showMapModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowMapModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                  <IonItem lines='full'>
                    {user && user.favorite_locations.find(loc => loc._id === selected._id) ? (
                      <IonButton fill="clear" onClick={() => setAlertUpdateFav({...alertUpdateFav, removeStatus: true, location: selected})}>
                        <IonIcon icon={bookmarks}/>
                        <IonBadge slot="end" color="danger">-</IonBadge>
                      </IonButton>
                      ) : (
                      <IonButton fill="clear" onClick={() => setAlertUpdateFav({...alertUpdateFav, addStatus: true, location: selected})}>
                        <IonIcon icon={bookmarksOutline}/>
                        <IonBadge slot="end" color="success">+</IonBadge>  
                      </IonButton>
                      )
                    }
                    <IonAlert
                      isOpen={alertUpdateFav.addStatus}
                      onDidDismiss={() => setAlertUpdateFav({...alertUpdateFav, addStatus: false })}
                      header={'Favoriten hinzufügen'}
                      message={'Möchtest du den Eisladen deinen Favoriten hinzufügen?'}
                      buttons={[
                        { text: 'Abbrechen', role: 'cancel' },
                        { text: 'Bestätigen', handler: addFavLoc }
                      ]}
                    />
                    <IonAlert
                      isOpen={alertUpdateFav.removeStatus}
                      onDidDismiss={() => setAlertUpdateFav({...alertUpdateFav, removeStatus: false })}
                      header={'Favoriten entfernen'}
                      message={'Möchtest du den Eisladen wirklich von deiner Liste entfernen?'}
                      buttons={[
                        { text: 'Abbrechen', role: 'cancel' },
                        { text: 'Bestätigen', handler: removeFavLoc }
                      ]}
                    />

                    <IonLabel>{selected.name}</IonLabel>
                    <IonButton fill="clear" onClick={() => setShowMapModal(false)}>
                      <IonIcon icon={closeCircleOutline }/>
                    </IonButton>
                  </IonItem>
                  <SelectedMarker />
                </IonModal>

                <IonModal cssClass='newLocModal' isOpen={showNewLocModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowNewLocModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                  <IonItem lines='full'>
                    <IonLabel>Eisladen eintragen</IonLabel>
                    <IonButton fill="clear" onClick={() => { setShowNewLocModal(false)}}><IonIcon icon={closeCircleOutline }/></IonButton>
                  </IonItem>
                  <NewLocationForm />
                </IonModal>
              </div>
            ) : null}

          </GoogleMap>

          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines="none">
              <IonLabel className="ion-text-wrap mb-2" position='stacked' htmlFor="address">Welchen Eisladen hast du entdeckt? Name und Stadt reichen zumeist. Sonst trage die korrekte Adresse ein.</IonLabel>
              <Controller
                control={control}
                render={({ 
                  field: { onChange, value, searchText, chosen, searchRef },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonSearchbar
                    type="search" 
                    inputmode="text" 
                    value={value || searchText } 
                    autocomplete='street-address' 
                    onIonChange={e => {
                      onChange(e.detail.value);
                      forAutocompleteChange(e.detail.value)
                    }} 
                    placeholder="Name, Adresse eintippen ..." 
                    searchIcon={add} 
                    showCancelButton="always"	
                    cancel-button-text="" 
                  />
                )}
                name="address"
                rules={{ required: true }}
              />
            </IonItem>
              {predict ? (
                <IonList>
                  {predict.map((item, i) => (
                    <IonItem className="autocompleteListItem" key={i} button onClick={() => onSubmit({'address': item.description})} lines="full">
                      <IonLabel className="ion-text-wrap">{item.description}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              ) : null}
              <IonButton fill="solid" expand="full" className="check-btn my-2" type="submit">
                <IonIcon icon={add} />Check: Erscheint ein grünes Icon? Klicke darauf
              </IonButton>
          </form>

        </IonContent>
      )}

      {segment === 'list' && (
        <ListMap />
      )}

      <IonLoading 
        isOpen={loading ? true : false} 
        message={"Einen Moment bitte ..."}
        onDidDismiss={() => setLoading(false)}
      />
      <IonToast 
        color='danger'
        isOpen={error ? true : false} 
        message={error} 
        onDidDismiss={() => setError(null)}
        duration={6000} 
      />
    </IonPage>
  ) : <Spinner /> ;
};

export default Entdecken;

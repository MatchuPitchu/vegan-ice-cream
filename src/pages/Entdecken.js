import { useContext, useState, useCallback, useRef } from "react";
import { Context } from '../context/Context';
import { Geolocation } from '@ionic-native/geolocation';
import { IonItem, IonButton, IonContent, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonSegment, IonSegmentButton, IonToggle, IonToolbar, IonAlert, IonBadge, isPlatform } from '@ionic/react';
import { Autocomplete, GoogleMap, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';
import { add, addCircleOutline, bookmarks, bookmarksOutline, closeCircleOutline, listCircle, location as myPos, map as mapIcon, refreshCircle, removeCircleOutline } from "ionicons/icons";
import NewLocationForm from "../components/NewLocationForm";
import Search from "../components/Search";
import SelectedMarker from '../components/SelectedMarker';
import ListMap from "../components/ListMap";
import Spinner from "../components/Spinner";
import LoadingError from "../components/LoadingError";

const Entdecken = () => {
  const {
    loading, setLoading, 
    error, setError,
    user, 
    locations,
    center, setCenter,
    zoom, setZoom,
    map, setMap,
    selected, setSelected,
    searchSelected, setSearchSelected,
    position, setPosition,
    newLocation, setNewLocation,
    all, setAll, 
    mapStyles, 
    enterAnimation, leaveAnimation, 
    showMapModal, setShowMapModal,
    showNewLocModal, setShowNewLocModal,
    alertUpdateFav, setAlertUpdateFav,
    addFavLoc,
    removeFavLoc
  } = useContext(Context);
  const [libraries] = useState(['places']);

  const [segment, setSegment] = useState('map');
  const [autocomplete, setAutocomplete] = useState(null);
  const [result, setResult] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState(null);
  
  const contentRef = useRef(null);
  const markerRef = useRef(null);

  const getLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
      setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
    } catch (error) {
      setError('Deine Position kann nicht ermittelt werden. Kontrolliere deine Einstellungen:', error)
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setAll(true);

    const fetchData = async () => {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(formattedAddress)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const { results } = await res.json();
        setNewLocation({
          ...result,
          address: {
            ...result.address,
            geo: {
              lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
              lng: results[0].geometry.location ? results[0].geometry.location.lng : null
            }
          }
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
        setTimeout(() => setError(null), 5000);
      }
    };
    fetchData();
    setLoading(false);
  };

  const checkDuplicate = () => {
    console.log(locations)
    console.log(newLocation)

    const duplicate = locations.find(loc => loc.address.street === newLocation.address.street && loc.address.number === newLocation.address.number)
    console.log(duplicate)
    
    if(duplicate) {
      setError('Diese Adresse gibt es schon.');
      setNewLocation(null)
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

  const onPlaceChanged = () => {
    if(autocomplete !== null) {
      const result = autocomplete.getPlace();
      let address = {};
      result.address_components.forEach(e => e.types.forEach(type => Object.assign(address, {[type]: e.long_name})));
      setFormattedAddress(result.formatted_address);
      setResult({
        name: '',
        address: {
          street: address.route ? address.route : '',
          number: address.street_number ? parseInt(address.street_number) : '',
          zipcode: address.postal_code ? address.postal_code : '',
          city: address.locality ? address.locality : '',
          country: address.country ? address.country : '',
          geo: {
            lat: null,
            lng: null
          }
        },
        location_url: result.website ? result.website : '',
        place_id: result.place_id ? result.place_id : ''
      })
      scrollDown()
    }
    else {
      setError('Autocomplete kann gerade nicht geladen werden');
      setTimeout(() => setError(null), 5000);
    }
  }
  
  const clusterOptions = {
    imagePath: './assets/icons/m'
  }

  const createKey = (location) => {
    return location.lat + location.lng
  }

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
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const onAutocompleteLoad = (autocomplete) => {
    setAutocomplete(autocomplete)
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
    controlDiv.addEventListener('click', () => { map.setCenter(center); map.setZoom(11)});
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
        
        <Search />
      
      </IonHeader>

      {segment === 'map' && (
        <IonContent ref={contentRef} scrollEvents>
          <div className="containerMap">
            <div className="control-left">
              <div className="col">
                <IonButton className="d-flex justify-content-start zoom-control-in zoomIcons" fill="clear" >
                  <IonIcon icon={addCircleOutline} />
                </IonButton>
                <IonButton className="d-flex justify-content-start zoom-control-out zoomIcons" fill="clear">
                  <IonIcon icon={removeCircleOutline} />
                </IonButton>
              </div>
            </div>
            <div className="control-right-top">
              <IonButton className="all-control" title="Mehr Eisläden laden" >
                <IonLabel className="me-1">Alle anzeigen</IonLabel>
                <IonToggle onIonChange={e => setAll(true)} checked={all} disabled={`${all ? 'true' : 'false'}`} />
              </IonButton>
           </div>
           <div className="control-right-bottom">
              <div className="col">
                { user ? ( 
                <div className="d-flex justify-content-end">
                  <IonButton className="add-control" onClick={scrollDown} title="Neue Adresse hinzufügen">
                    <IonIcon icon={add} />
                  </IonButton>
                </div>
                ) : null}
                <div className="d-flex justify-content-end">
                  <IonButton className="where-control" onClick={getLocation} title="Mein Standort">
                    <IonIcon icon={myPos} />
                  </IonButton>
                </div>
                <div className="d-flex justify-content-end">
                  <IonButton className="center-control" title="Karte auf Anfangspunkt zentrieren" >
                    <IonIcon icon={refreshCircle} />
                  </IonButton>
                </div>
              </div>
            </div>

            <GoogleMap 
              mapContainerClassName="map" 
              zoom={zoom} 
              center={center}
              options={options}
              onLoad={onMapLoad}
              onUnmount={onUnmount}
              zIndex={10}
            >

              <MarkerClusterer 
                options={clusterOptions}
                imageExtension='png'
                // zoomOnClick={false}
              >
                {(clusterer) =>
                  locations ? locations.map(loc => (
                    <Marker 
                      key={createKey({lat: loc.address.geo.lat, lng: loc.address.geo.lng})} 
                      position={{lat: loc.address.geo.lat, lng: loc.address.geo.lng}} 
                      clusterer={clusterer}
                      icon={newLocation && 
                        newLocation.address.street === loc.address.street && 
                        newLocation.address.number === loc.address.number ?
                        {
                          url: './assets/icons/ice-cream-icon-dark.svg',
                          scaledSize: new window.google.maps.Size(0, 0)
                        } : {
                          url: searchSelected && searchSelected.address.geo.lat === loc.address.geo.lat && 
                            searchSelected.address.geo.lng === loc.address.geo.lng ?
                            './assets/icons/selected-ice-location.svg' : './assets/icons/ice-cream-icon-dark.svg',
                          scaledSize: new window.google.maps.Size(30, 30),
                          origin: new window.google.maps.Point(0, 0),
                          anchor: new window.google.maps.Point(15, 15)
                      }}
                      shape={{
                        coords: [1, 1, 1, 28, 26, 28, 26, 1],
                        type: "poly",
                      }}
                      title={`${loc.name}, ${loc.address.street} ${loc.address.number}`}
                      cursor='pointer'
                      onClick={() => { setSelected(loc); setShowMapModal(true) }}
                    />
                    )
                  ) : null}

              </MarkerClusterer>

              {/* {locations ? locations.map(loc => (
                <Marker
                  key={loc._id}
                  position={{lat: loc.address.geo.lat, lng: loc.address.geo.lng}}
                  // If newLocation exists on same place as normal marker, than normal marker is size 0
                  // If newLocation does not exist than condition: if searchSelected exists on same place as normal marker,
                  // than normal marker becomes green, otherwise normal marker is alway dark
              */}

              {position ? (
                <Marker
                  position={{lat: position.lat, lng: position.lng}}
                  icon={{
                    url: './assets/icons/current-position-marker.svg',
                    scaledSize: new window.google.maps.Size(60, 60),
                  }}
                />
                ) : null}

              {newLocation ? (
                <Marker
                  ref={markerRef}
                  position={{lat: newLocation.address.geo.lat, lng: newLocation.address.geo.lng}}
                  icon={{
                    url: './assets/icons/newLocation-marker.svg',
                    scaledSize: new window.google.maps.Size(30, 30),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15)
                  }}
                  optimized={false}
                  title={`${newLocation.address.street} ${newLocation.address.number}, ${newLocation.address.zipcode} ${newLocation.address.city}`}
                  onClick={() => checkDuplicate()}
                />
              ) : null}

              {selected ? (
                <div>
                  <IonModal cssClass='mapModal' isOpen={showMapModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowMapModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                      <IonItem lines='full'>
                        {user ? (
                          <>
                          {user.favorite_locations.find(loc => loc._id === selected._id) ? (
                            <IonButton fill="clear" onClick={() => setAlertUpdateFav({...alertUpdateFav, removeStatus: true, location: selected})}>
                              <IonIcon icon={bookmarks}/>
                              <IonBadge slot="end" color="danger">-</IonBadge>
                            </IonButton>
                            ) : (
                            <IonButton fill="clear" onClick={() => setAlertUpdateFav({...alertUpdateFav, addStatus: true, location: selected})}>
                              <IonIcon icon={bookmarksOutline}/>
                              <IonBadge slot="end" color="success">+</IonBadge>  
                            </IonButton>
                            )}
                          </>
                        ) : null}
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
          </div>


          {user ? (
            <form onSubmit={onSubmit}>
              <IonItem lines="none">
                <IonLabel className={`container ion-text-wrap ${isPlatform('desktop') ? 'mb-4' : 'my-2'}`} position="stacked">
                  Welchen Eisladen hast du entdeckt? Name und Stadt reichen zumeist. Sonst trage die korrekte Adresse ein.
                </IonLabel>
                <Autocomplete
                  className='container-autocomplete'
                  onLoad={ onAutocompleteLoad }
                  onPlaceChanged={ onPlaceChanged }
                  restrictions={ { country: 'de' } }
                  fields={ ['address_components', 'formatted_address', 'place_id', 'website']}
                >
                  <input 
                    type="text"
                    placeholder="Name, Adresse eintippen ..."
                    className="search-autocomplete"
                  />
                </Autocomplete>
                <IonButton fill="solid" className="check-btn my-3" type="submit">
                  <IonIcon icon={add} />Check: Erscheint ein grünes Icon? Klicke darauf
                </IonButton>
              </IonItem>
            </form>
          ) : null}

        </IonContent>
      )}

      {segment === 'list' && (
        <ListMap />
      )}

    <LoadingError />
    
    </IonPage>
  ) : <Spinner /> ;
};

export default Entdecken;

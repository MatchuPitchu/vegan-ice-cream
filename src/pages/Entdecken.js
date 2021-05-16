import { useContext, useState, useCallback, useRef } from "react";
import { Context } from '../context/Context';
import { Geolocation } from '@ionic-native/geolocation';
import { IonItem, IonButton, IonContent, IonHeader, IonIcon, IonLabel, IonModal, IonPage, IonSegment, IonSegmentButton, IonToolbar, isPlatform } from '@ionic/react';
import { Autocomplete, GoogleMap, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';
import { add, addCircleOutline, closeCircleOutline, listCircle, location as myPos, map as mapIcon, refreshCircle, removeCircleOutline, search } from "ionicons/icons";
import NewLocationForm from "../components/NewLocationForm";
import Search from "../components/Search";
import SelectedMarker from '../components/SelectedMarker';
import ListMap from "../components/ListMap";
import Spinner from "../components/Spinner";
import LoadingError from "../components/LoadingError";
import FavLocBtn from "../components/FavLocBtn";

const Entdecken = () => {
  const {
    loading, setLoading, 
    error, setError,
    user, 
    locations,
    locationsMap,
    center, setCenter,
    zoom, setZoom,
    map, setMap,
    viewport, setViewport,
    selected, setSelected,
    searchSelected, setSearchSelected,
    position, setPosition,
    newLocation, setNewLocation,
    all, setAll, 
    mapStyles, 
    enterAnimation, leaveAnimation, 
    showMapModal, setShowMapModal,
    showNewLocModal, setShowNewLocModal,
    setOpenComments
  } = useContext(Context);
  const [libraries] = useState(['places']);

  const [segment, setSegment] = useState('map');
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchAutocomplete, setSearchAutocomplete] = useState('');
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

    const duplicate = locations.find(loc => loc.address.street === result.address.street && loc.address.number === result.address.number)    
    if(duplicate) {
      setResult(null)
      setError('Diese Adresse gibt es schon.');
      setTimeout(() => setError(null), 5000);
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(formattedAddress ? formattedAddress : searchAutocomplete)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const { results } = await res.json();
        console.log(results)
        
        if(result.address.number) {
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
        } else {
          let address = {};
          results[0].address_components && results[0].address_components.forEach(e => e.types.forEach(type => Object.assign(address, {[type]: e.long_name})));
          setNewLocation({
            name: '',
            address: {
              street: address.route ? address.route : '',
              number: address.street_number ? parseInt(address.street_number) : '',
              zipcode: address.postal_code ? address.postal_code : '',
              city: address.locality ? address.locality : '',
              country: address.country ? address.country : '',
              geo: {
                lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
                lng: results[0].geometry.location ? results[0].geometry.location.lng : null
              }
            },
            location_url: '',
            place_id: address.place_id ? address.place_id : ''
          })
        }

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
    if(!duplicate) fetchData();
    setSearchAutocomplete('');
    setLoading(false);
  };

  const scrollDown = () => {
    // (number) means duration
    contentRef.current && contentRef.current.scrollToBottom(500);
  };

  const onPlaceChanged = () => {
    if(autocomplete !== null) {
      const data = autocomplete.getPlace();
      let address = {};
      data.address_components && data.address_components.forEach(e => e.types.forEach(type => Object.assign(address, {[type]: e.long_name})));
      setFormattedAddress(data.formatted_address);
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
        location_url: data.website ? data.website : '',
        place_id: data.place_id ? data.place_id : ''
      })
      scrollDown()
    }
    else {
      setError('Autocomplete kann gerade nicht geladen werden');
      setTimeout(() => setError(null), 5000);
    }
  }
  
  const searchViewport = () => {
    let { Ua, La } = map.getBounds()
    const latLngBounds = {
      southLat: Ua.g,
      westLng: La.g,
      northLat: Ua.i,
      eastLng: La.i,
    };
    setViewport(latLngBounds);
  }

  const clusterOptions = {
    imagePath: './assets/icons/m'
  }

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    gestureHandling: "cooperative",
    minZoom: 9,
    // restricted to boundaries of germany
    restriction: {
      latLngBounds: {
        south: 47.1,
        west: 5.8,
        north: 55.1,
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
              <div className="col">
                <div className="d-flex justify-content-end">
                  <IonButton className="viewport-control" onClick={searchViewport}>
                    <IonLabel className="me-1">In diesem Gebiet suchen</IonLabel>
                    <IonIcon slot="start" icon={search} />
                  </IonButton>
                </div>
                {/* <div className="d-flex justify-content-end">
                  <IonButton className="all-control" title="Mehr Eisläden laden" >
                    <IonLabel className="me-1">Alle anzeigen</IonLabel>
                    <IonToggle onIonChange={e => setAll(true)} checked={all} disabled={`${all ? 'true' : 'false'}`} />
                  </IonButton>
                </div> */}
              </div>
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
              >
                {(clusterer) =>
                  locationsMap ? locationsMap.map(loc => (
                    <Marker
                      key={loc._id} 
                      position={{lat: loc.address.geo.lat, lng: loc.address.geo.lng}} 
                      clusterer={clusterer}
                      // If newLocation exists on same place as normal marker, than normal marker is size 0
                      // If newLocation does not exist than condition: if searchSelected exists on same place as normal marker,
                      // than normal marker becomes green, otherwise normal marker is alway dark
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
                  title={`${newLocation.address.street} ${newLocation.address.number} ${newLocation.address.zipcode} ${newLocation.address.city}`}
                  onClick={() => { 
                    setSelected(newLocation); 
                    setShowNewLocModal(true); 
                  }}
                />
              ) : null}

              {selected ? (
                <div>
                  <IonModal cssClass='mapModal' isOpen={showMapModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowMapModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                      <IonItem lines='full'>
                        {user ? <FavLocBtn /> : null}
                        <IonLabel>{selected.name}</IonLabel>
                        <IonButton fill="clear" onClick={() => {setOpenComments(false); setShowMapModal(false)}} >
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
                    // value={searchText}
                    onChange={(e) => setSearchAutocomplete(e.target.value)}
                  />
                </Autocomplete>
                <IonButton fill="solid" className="check-btn my-3" type="submit">
                  <IonIcon icon={add} />Check: Klicke auf das neue grüne Icon
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

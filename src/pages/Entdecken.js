import { useContext, useState, useEffect, useCallback } from "react";
import { Context } from '../context/Context';
import { Geolocation } from '@ionic-native/geolocation';
import { IonPopover, IonButton, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react';
import { GoogleMap, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';
import { add, addCircleOutline, create, listCircle, location as myPos, logIn, map as mapIcon, refreshCircle, removeCircleOutline, search } from "ionicons/icons";
import NewLocationForm from "../components/NewLocationForm";
import Search from "../components/Search";
import SelectedMarker from '../components/SelectedMarker';
import ListMap from "../components/ListMap";
import Spinner from "../components/Spinner";
import LoadingError from "../components/LoadingError";
import AutocompleteForm from "../components/AutocompleteForm";

const Entdecken = () => {
  const {
    setError,
    user, 
    locationsMap,
    center, setCenter,
    zoom,
    segment, setSegment,
    map, setMap,
    setAutocompleteModal,
    searchViewport,
    selected, setSelected,
    searchSelected,
    position, setPosition,
    newLocation,
    checkMsgNewLoc, setCheckMsgNewLoc,
    mapStyles, 
    setInfoModal,
    setNewLocation,
    setNewLocModal,
    setOpenComments
  } = useContext(Context);
  const [libraries] = useState(['places']);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });

  useEffect(() => {
    if(map) setTimeout(() => searchViewport(), 2000);
  }, [map])

  useEffect(() => {
    if(user && user.home_city.geo.lat) setCenter({ lat:  user.home_city.geo.lat, lng: user.home_city.geo.lng });
      else setCenter({ lat:  52.524, lng: 13.410 })
  }, [user])

  const getLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
      setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
    } catch (error) {
      setError('Deine Position kann nicht ermittelt werden. Kontrolliere deine Einstellungen:', error)
      setTimeout(() => setError(null), 5000);
    }
  };

  const clusterOptions = {
    imagePath: './assets/icons/m'
  }

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    gestureHandling: "cooperative",
    minZoom: 7,
    // restricted to boundaries of germany
    restriction: {
      latLngBounds: {
        south: 47.1,
        west: 5.7,
        north: 55.3,
        east: 15.3,
      },
    },
  }

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, [])

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  return (isLoaded) ? (
    <IonPage>
      <IonToolbar className="segmentsToolbar">
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

      {segment === 'map' && (
        <IonContent>
          <div className="containerMap">
            <div className="control-left d-flex flex-column">
              <IonButton 
                className="zoomIcons" 
                fill="clear"
                // Add customs zoom control https://developers.google.com/maps/documentation/javascript/examples/control-replacement#maps_control_replacement-javascript
                onclick={() => map.setZoom(map.getZoom() + 1)}
              >
                <IonIcon icon={addCircleOutline} />
              </IonButton>
              <IonButton 
                className="zoom-control-out zoomIcons" 
                fill="clear"
                onclick ={() => map.setZoom(map.getZoom() - 1)}
              >
                <IonIcon icon={removeCircleOutline} />
              </IonButton>
            </div>
            <div className="d-flex flex-column align-items-end control-right-top">
              <IonButton className="viewport-control" onClick={searchViewport}>
                <IonLabel className="me-1">Eisläden im Gebiet</IonLabel>
                <IonIcon slot="start" icon={search} />
              </IonButton>

              <IonButton 
                className="add-control" 
                onClick={(e) => {
                  if (user) {
                    setNewLocation(null);
                    setAutocompleteModal(true);
                  } else {
                    e.persist();
                    setPopoverShow({ show: true, event: e })
                  }
                }}
                title="Neue Adresse hinzufügen"
              >
                <IonLabel className="me-1">Neuer Laden</IonLabel>
                <IonIcon slot="start" icon={add} />
              </IonButton>
              <IonPopover
                color="primary"
                cssClass='info-popover'
                event={popoverShow.event}
                isOpen={popoverShow.show}
                onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
                >
                <div className="my-2">
                  <div>Nur für eingeloggte User</div>
                  <IonButton routerLink='/login' fill="solid" className="click-btn mt-2">
                    <IonLabel>Login</IonLabel>
                    <IonIcon className="pe-1" icon={logIn} />
                  </IonButton>
                  <IonButton routerLink='/register' fill="solid" className="click-btn">
                    <IonLabel>Registrieren</IonLabel>
                    <IonIcon className="pe-1" icon={create} />
                  </IonButton>
                </div>
              </IonPopover>
               
              <AutocompleteForm />

              <IonButton className="where-control" onClick={getLocation} title="Mein Standort">
                <IonIcon icon={myPos} />
              </IonButton>
            
              <IonButton 
                className="center-control" 
                title="Karte auf Anfangspunkt zentrieren"
                onClick={() => { 
                  map.setCenter(center); 
                  map.setZoom(12)
                }}
              >
                <IonIcon icon={refreshCircle} />
              </IonButton>
            </div>

            <GoogleMap 
              mapContainerClassName="map" 
              zoom={zoom} 
              center={center}
              options={options}
              onLoad={onMapLoad}
              onUnmount={onUnmount}
            >
              <MarkerClusterer 
                options={clusterOptions}
                imageExtension='png'
                averageCenter
              >
                {(clusterer) =>
                  locationsMap ? locationsMap.map(loc => (
                    // if searchSelected exists, than normal marker at this position is null 
                    searchSelected &&
                    searchSelected.address.geo.lat === loc.address.geo.lat &&
                    searchSelected.address.geo.lng === loc.address.geo.lng ? (
                      null ) : (
                        <Marker
                          key={loc._id} 
                          position={{ lat: loc.address.geo.lat, lng: loc.address.geo.lng }} 
                          clusterer={clusterer}
                          icon={{
                            url: './assets/icons/ice-cream-icon-dark.svg',
                            scaledSize: searchSelected &&
                              searchSelected.address.geo.lat === loc.address.geo.lat &&
                              searchSelected.address.geo.lng === loc.address.geo.lng ?             
                              new window.google.maps.Size(0, 0) : new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15)
                          }}
                          shape={{
                            coords: [1, 1, 1, 28, 26, 28, 26, 1],
                            type: "poly",
                          }}
                          optimized={false}
                          title={`${loc.name}, ${loc.address.street} ${loc.address.number}`}                     cursor='pointer'
                          onClick={() => {
                            setOpenComments(false); 
                            setSelected(loc); 
                            setInfoModal(true) 
                          }}
                          zIndex={1}
                        />
                      )
                    )
                  ) : null}
              </MarkerClusterer>

              {searchSelected ? (
                <Marker
                  position={{lat: searchSelected.address.geo.lat, lng: searchSelected.address.geo.lng}}
                  icon={{
                    url: './assets/icons/selected-ice-location.svg',
                    scaledSize: new window.google.maps.Size(30, 30),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15)
                  }}
                  optimized={false}
                  title={`${searchSelected.address.street} ${searchSelected.address.number} ${searchSelected.address.zipcode} ${searchSelected.address.city}`}
                  onClick={() => { 
                    setOpenComments(false);
                    setSelected(searchSelected); 
                    setInfoModal(true); 
                  }}
                  zIndex={2}
                />
              ) : null}

              {position ? (
                <Marker
                  position={{lat: position.lat, lng: position.lng}}
                  icon={{
                    url: './assets/icons/current-position-marker.svg',
                    scaledSize: new window.google.maps.Size(60, 60),
                  }}
                  zIndex={1}
                />
                ) : null}

              {newLocation ? (
                <>
                  <Marker
                    position={{lat: newLocation.address.geo.lat, lng: newLocation.address.geo.lng}}
                    icon={{
                      url: './assets/icons/newLocation-marker.svg',
                      scaledSize: new window.google.maps.Size(40, 40),
                      origin: new window.google.maps.Point(0, 0),
                      anchor: new window.google.maps.Point(15, 15)
                    }}
                    optimized={false}
                    title={`${newLocation.address.street} ${newLocation.address.number} ${newLocation.address.zipcode} ${newLocation.address.city}`}
                    cursor='pointer'
                    onClick={() => {
                      setCheckMsgNewLoc('');
                      setNewLocModal(true)
                    }}
                    zIndex={3}
                  />
                  <NewLocationForm />
                </>
              ) : null}

              {selected ? <SelectedMarker /> : null}


            </GoogleMap>
            
            {checkMsgNewLoc && (
              <div className="checkMsg">
                {checkMsgNewLoc}
              </div>
            )}
          </div>

        </IonContent>
      )}

      {segment === 'list' && <ListMap /> }

      <LoadingError />
    
    </IonPage>
  ) : (
  <IonPage>
    <Spinner />
  </IonPage>
  )
};

export default Entdecken;
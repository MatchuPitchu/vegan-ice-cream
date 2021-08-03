import { useContext, useState, useEffect, useCallback } from "react";
import { Context } from '../context/Context';
import { IonPopover, IonButton, IonContent, IonIcon, IonLabel, IonPage, IonSegment, IonSegmentButton } from '@ionic/react';
import { GoogleMap, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';
import { add, addCircleOutline, create, listCircle, logIn, map as mapIcon, refreshCircle, removeCircleOutline } from "ionicons/icons";
import NewLocationForm from "../components/NewLocationForm";
import Search from "../components/Search";
import SelectedMarker from '../components/SelectedMarker';
import ListMap from "../components/ListMap";
import Spinner from "../components/Spinner";
import LoadingError from "../components/LoadingError";
import AutocompleteForm from "../components/AutocompleteForm";
import GeolocationBtn from "../components/GeolocationBtn";

const Entdecken = () => {
  const {
    setError,
    user,
    locations,
    // if too many locations in database later, then detach locations on the map displayed in viewport from locations
    // locationsMap,
    center, setCenter,
    zoom, setZoom,
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

  // deactivated until there are so many locations in the database, that search in viewport is needed
  // useEffect(() => {
  //   if(map) setTimeout(() => searchViewport(), 750);
  // }, [map])

  useEffect(() => {
    // if user exists with indicated home city than first center + zoom
    if(user && user.home_city.geo.lat) {
      setCenter({ lat:  user.home_city.geo.lat, lng: user.home_city.geo.lng });
      setZoom(12);
    } else {
      setCenter({ lat:  52.524, lng: 13.410 })
      setZoom(12)
    }
  }, [])

  useEffect(() => {
    if(searchSelected) {
      // zoom + center when user chooses item in prediction list
      setCenter({
        lat: searchSelected.address.geo.lat, 
        lng: searchSelected.address.geo.lng
      })
      setZoom(15);
    } else {
      setZoom(12)
    }
  }, [searchSelected])

  const clusterOptions = {
    imagePath: './assets/icons/m'
  }

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    gestureHandling: "cooperative",
    minZoom: 7,
    // restricted to boundaries of viewport DE, CH, AUT
    restriction: {
      latLngBounds: {
        south: 45.75,
        west: 5.7,
        north: 55.15,
        east: 17.2,
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
      <div>
        <IonSegment
          onIonChange={(e) => setSegment(e.detail.value)} 
          value={segment}
          swipe-gesture
          className="segments"
        >
          <IonSegmentButton className="segmentBtn" value='map' layout="icon-start">
            <IonLabel>Karte</IonLabel>
            <IonIcon icon={mapIcon} />
          </IonSegmentButton>
          <IonSegmentButton className="segmentBtn" value='list' layout="icon-start">
            <IonLabel>Liste</IonLabel>
            <IonIcon icon={listCircle} />
          </IonSegmentButton>
        </IonSegment>
      </div>

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

              {/* deactivated until there are so many locations in the database that, for performance reasons, loaded locations have to be decoupled  */}
              {/* <IonButton className="viewport-control" onClick={searchViewport}>
                <IonLabel className="me-1">Eisläden im Gebiet</IonLabel>
                <IonIcon slot="start" icon={search} />
              </IonButton> */}

              <IonButton 
                className="add-control" 
                onClick={(e) => {
                  if (user) {
                    setNewLocation(null);
                    setAutocompleteModal(true);
                    // set to empty string for case that user adds new loc icon but never clicks on icon
                    setCheckMsgNewLoc('');
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

              <GeolocationBtn />
            
              <IonButton 
                className="center-control" 
                title="Karte zentrieren: auf eigenen Standort (falls aktiviert), sonst auf Anfangspunkt"
                onClick={() => {
                  // if no user position take users home city or general lat lng values + default zoom; otherwise recenter on users position
                  !position ? map.setCenter({ lat: user && user.home_city.geo.lat || 52.524, lng: user && user.home_city.geo.lng || 13.410 }) : map.setCenter({ lat: position.lat, lng: position.lng });
                  map.setZoom(user && user.home_city.geo.lat ? 12 : 9)
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
                  locations ? locations.map(loc => (
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
                            setCenter({
                              lat: loc.address.geo.lat,
                              lng: loc.address.geo.lng
                            })
                          }}
                          zIndex={1}
                        />
                      )
                    )
                  ) : null}
              </MarkerClusterer>

              {searchSelected ? (
                // Marker of ice cream location selected in searchbar
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
                // Current position marker of user
                <Marker
                  position={{lat: position.lat, lng: position.lng}}
                  icon={{
                    url: './assets/icons/current-position-marker.svg',
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                  onClick={() => {
                    setCenter({lat: position.lat, lng: position.lng});
                    // zoom in on click untill zoom level of 17
                    setZoom(prev => prev < 18 ? prev + 1 : prev)
                  }}
                  zIndex={1}
                />
                ) : null}

              {newLocation ? (
                // Marker for new ice cream location
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
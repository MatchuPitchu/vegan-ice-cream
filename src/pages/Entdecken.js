import { useContext, useState, useEffect, useCallback } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { appActions } from '../store/appSlice';
import { mapActions } from '../store/mapSlice';
// Context
import { Context } from '../context/Context';
import { useThemeContext } from '../context/ThemeContext';
import {
  IonPopover,
  IonButton,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { GoogleMap, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';
import {
  add,
  addCircleOutline,
  create,
  listCircle,
  logIn,
  map as mapIcon,
  refreshCircle,
  removeCircleOutline,
} from 'ionicons/icons';
import NewLocationForm from '../components/NewLocationForm';
import Search from '../components/Search';
import LocationInfoModal from '../components/LocationInfoModal';
import ListMap from '../components/ListMap';
import Spinner from '../components/Spinner';
import LoadingError from '../components/LoadingError';
import AutocompleteForm from '../components/AutocompleteForm';
import GeolocationBtn from '../components/GeolocationBtn';
import { getSelectedLocation, locationsActions } from '../store/locationsSlice';
import { searchActions } from '../store/searchSlice';
import { showActions } from '../store/showSlice';

const Entdecken = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { center, zoom } = useAppSelector((state) => state.map);
  const selectedLocation = useAppSelector(getSelectedLocation);
  const { checkMsgNewLocation, entdeckenSegment } = useAppSelector((state) => state.app);
  const { locations, newLocation } = useAppSelector((state) => state.locations);

  const { mapStyles } = useThemeContext();
  const { setMap, setNewLocModal } = useContext(Context);

  const [currentUserPosition, setCurrentUserPosition] = useState(null);

  const [libraries] = useState(['places']);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });

  useEffect(() => {
    // if user exists with indicated home city than first center + zoom
    dispatch(
      mapActions.setCenter({
        lat: user?.home_city?.geo?.lat || 52.524,
        lng: user?.home_city?.geo?.lng || 13.41,
      })
    );
    dispatch(mapActions.setZoom(12));
  }, [user, dispatch]);

  useEffect(() => {
    if (selectedLocation) {
      // zoom + center when user chooses item in prediction list
      dispatch(
        mapActions.setCenter({
          lat: selectedLocation.address.geo.lat,
          lng: selectedLocation.address.geo.lng,
        })
      );
      dispatch(mapActions.setZoom(15));
    } else {
      dispatch(mapActions.setZoom(12));
    }
  }, [selectedLocation, dispatch]);

  const clusterOptions = {
    imagePath: './assets/icons/m',
  };

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    gestureHandling: 'cooperative',
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
  };

  // use useCallback with empty dependencies to avoid that setMap is re-executed on every rerendering
  // so the hook returns (memoizes) the function instance between renderings;
  // the map has a fixed reference in the memory (notice: read more about it)
  const onMapLoad = useCallback((map) => setMap(map), [setMap]);
  const onUnmount = useCallback(() => setMap(null), [setMap]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleOpenLocationInfoModal = () => dispatch(showActions.setShowLocationInfoModal(true));

  const handleCenterMap = () => {
    // if no user position take users home city or general lat lng values + default zoom; otherwise recenter on users position
    currentUserPosition
      ? dispatch(
          mapActions.setCenter({ lat: currentUserPosition.lat, lng: currentUserPosition.lng })
        )
      : dispatch(
          mapActions.setCenter({
            lat: user?.home_city?.geo?.lat || 52.524,
            lng: user?.home_city?.geo?.lng || 13.41,
          })
        );
    dispatch(mapActions.setZoom(12));
  };

  return isLoaded ? (
    <IonPage>
      <div>
        <IonSegment
          onIonChange={({ detail: { value } }) => {
            dispatch(appActions.setEntdeckenSegment(value));
            dispatch(searchActions.setSearchText('')); // if segment is changed, then reset searchbar
          }}
          value={entdeckenSegment}
          swipe-gesture
          className='segments'
        >
          <IonSegmentButton className='segmentBtn' value='map' layout='icon-start'>
            <IonLabel>Karte</IonLabel>
            <IonIcon icon={mapIcon} />
          </IonSegmentButton>
          <IonSegmentButton className='segmentBtn' value='list' layout='icon-start'>
            <IonLabel>Liste</IonLabel>
            <IonIcon icon={listCircle} />
          </IonSegmentButton>
        </IonSegment>
      </div>

      <Search />

      {entdeckenSegment === 'map' && (
        <IonContent>
          <div className='containerMap'>
            <div className='control-left d-flex flex-column'>
              <IonButton
                className='zoomIcons'
                fill='clear'
                // Add customs zoom control https://developers.google.com/maps/documentation/javascript/examples/control-replacement#maps_control_replacement-javascript
                onclick={() => dispatch(mapActions.incrementZoom())}
              >
                <IonIcon icon={addCircleOutline} />
              </IonButton>
              <IonButton
                className='zoom-control-out zoomIcons'
                fill='clear'
                onclick={() => dispatch(mapActions.decreaseZoom())}
              >
                <IonIcon icon={removeCircleOutline} />
              </IonButton>
            </div>
            <div className='d-flex flex-column align-items-end control-right-top'>
              <IonButton
                className='add-control'
                onClick={(event) => {
                  if (user) {
                    dispatch(locationsActions.resetNewLocation());
                    dispatch(appActions.setCheckMsgNewLocation('')); // remove message in case that user adds new location but never clicks on it
                    dispatch(showActions.setShowAddNewLocationModal(true));
                  } else {
                    event.persist();
                    setPopoverShow({ show: true, event });
                  }
                }}
                title='Neue Adresse hinzufügen'
              >
                <IonLabel className='me-1'>Neuer Laden</IonLabel>
                <IonIcon slot='start' icon={add} />
              </IonButton>
              <IonPopover
                color='primary'
                cssClass='info-popover'
                event={popoverShow.event}
                isOpen={popoverShow.show}
                onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
              >
                <div className='my-2'>
                  <div>Nur für eingeloggte User</div>
                  <IonButton routerLink='/login' fill='solid' className='click-btn mt-2'>
                    <IonLabel>Login</IonLabel>
                    <IonIcon className='pe-1' icon={logIn} />
                  </IonButton>
                  <IonButton routerLink='/register' fill='solid' className='click-btn'>
                    <IonLabel>Registrieren</IonLabel>
                    <IonIcon className='pe-1' icon={create} />
                  </IonButton>
                </div>
              </IonPopover>

              <AutocompleteForm />

              <GeolocationBtn
                currentUserPosition={currentUserPosition}
                setCurrentUserPosition={setCurrentUserPosition}
              />

              <IonButton
                className='center-control'
                title='Karte zentrieren: auf eigenen Standort (falls aktiviert), sonst auf Anfangspunkt'
                onClick={handleCenterMap}
              >
                <IonIcon icon={refreshCircle} />
              </IonButton>
            </div>

            <GoogleMap
              mapContainerClassName='map'
              zoom={zoom}
              center={center}
              options={options}
              onLoad={onMapLoad}
              onUnmount={onUnmount}
            >
              <MarkerClusterer options={clusterOptions} imageExtension='png' averageCenter>
                {(clusterer) =>
                  locations?.map((location) =>
                    // if selectedLocation exists, than normal marker at this position is null
                    selectedLocation &&
                    selectedLocation.address.geo.lat === location.address.geo.lat &&
                    selectedLocation.address.geo.lng === location.address.geo.lng ? null : (
                      <Marker
                        key={location._id}
                        position={{ lat: location.address.geo.lat, lng: location.address.geo.lng }}
                        clusterer={clusterer}
                        icon={{
                          url: './assets/icons/ice-cream-icon-dark.svg',
                          scaledSize:
                            selectedLocation &&
                            selectedLocation.address.geo.lat === location.address.geo.lat &&
                            selectedLocation.address.geo.lng === location.address.geo.lng
                              ? new window.google.maps.Size(0, 0)
                              : new window.google.maps.Size(30, 30),
                          origin: new window.google.maps.Point(0, 0),
                          anchor: new window.google.maps.Point(15, 15),
                        }}
                        shape={{
                          coords: [1, 1, 1, 28, 26, 28, 26, 1],
                          type: 'poly',
                        }}
                        optimized={false}
                        title={`${location.name}, ${location.address.street} ${location.address.number}`}
                        cursor='pointer'
                        onClick={() => {
                          dispatch(locationsActions.setSelectedLocation(location._id));
                          handleOpenLocationInfoModal();
                          dispatch(
                            mapActions.setCenter({
                              lat: location.address.geo.lat,
                              lng: location.address.geo.lng,
                            })
                          );
                        }}
                        zIndex={1}
                      />
                    )
                  )
                }
              </MarkerClusterer>

              {selectedLocation ? (
                // Marker of ice cream location selected in searchbar
                <Marker
                  position={{
                    lat: selectedLocation.address.geo.lat,
                    lng: selectedLocation.address.geo.lng,
                  }}
                  icon={{
                    url: './assets/icons/selected-ice-location.svg',
                    scaledSize: new window.google.maps.Size(30, 30),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                  }}
                  optimized={false}
                  title={`${selectedLocation.address.street} ${selectedLocation.address.number} ${selectedLocation.address.zipcode} ${selectedLocation.address.city}`}
                  onClick={handleOpenLocationInfoModal}
                  zIndex={2}
                />
              ) : null}

              {currentUserPosition && (
                // Current position marker of user
                <Marker
                  position={{ lat: currentUserPosition.lat, lng: currentUserPosition.lng }}
                  icon={{
                    url: './assets/icons/current-position-marker.svg',
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                  onClick={() => {
                    dispatch(
                      mapActions.setCenter({
                        lat: currentUserPosition.lat,
                        lng: currentUserPosition.lng,
                      })
                    );
                    dispatch(mapActions.zoomIn());
                  }}
                  zIndex={1}
                />
              )}

              {newLocation && (
                // Marker for new ice cream location
                <>
                  <Marker
                    position={{
                      lat: newLocation.address.geo.lat,
                      lng: newLocation.address.geo.lng,
                    }}
                    icon={{
                      url: './assets/icons/newLocation-marker.svg',
                      scaledSize: new window.google.maps.Size(40, 40),
                      origin: new window.google.maps.Point(0, 0),
                      anchor: new window.google.maps.Point(15, 15),
                    }}
                    optimized={false}
                    title={`${newLocation.address.street} ${newLocation.address.number} ${newLocation.address.zipcode} ${newLocation.address.city}`}
                    cursor='pointer'
                    onClick={() => {
                      dispatch(appActions.setCheckMsgNewLocation(''));
                      setNewLocModal(true);
                    }}
                    zIndex={3}
                  />
                  <NewLocationForm />
                </>
              )}

              {selectedLocation && <LocationInfoModal selectedLocation={selectedLocation} />}
            </GoogleMap>

            {checkMsgNewLocation && <div className='checkMsg'>{checkMsgNewLocation}</div>}
          </div>
        </IonContent>
      )}

      {entdeckenSegment === 'list' && <ListMap />}

      <LoadingError />
    </IonPage>
  ) : (
    <IonPage>
      <Spinner />
    </IonPage>
  );
};

export default Entdecken;

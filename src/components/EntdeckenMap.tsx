import { useState, useEffect, VFC, useMemo } from 'react';
import type { IceCreamLocation, PopoverState } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { appActions } from '../store/appSlice';
import { mapActions } from '../store/mapSlice';
import { getSelectedLocation, locationsActions } from '../store/locationsSlice';
import { showActions } from '../store/showSlice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import { IonPopover, IonButton, IonContent, IonIcon, IonLabel } from '@ionic/react';
import { GoogleMap, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api';
import {
  add,
  addCircleOutline,
  create,
  logIn,
  refreshCircle,
  removeCircleOutline,
} from 'ionicons/icons';
import NewLocationForm from '../components/NewLocationForm';
import LocationInfoModal from '../components/LocationInfoModal';
import Spinner from '../components/Spinner';
import NewLocationSearchForm from './NewLocationSearchForm';
import GeolocationButton from '../components/GeolocationButton';
import PopoverContentNotRegistered from './Popover/PopoverContentNotRegistered';

const defaultCenterPosition = {
  lat: 52.524,
  lng: 13.41,
};

interface GeoCoordinates {
  lat: number;
  lng: number;
}

type GoogleApiLibraries = ('places' | 'geometry' | 'drawing' | 'localContext' | 'visualization')[];

const libraries: GoogleApiLibraries = ['places'];

const EntdeckenMap: VFC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const { center, zoom } = useAppSelector((state) => state.map);
  const selectedLocation = useAppSelector(getSelectedLocation);

  const { confirmMessageNewLocation } = useAppSelector((state) => state.app);
  const { locations, newLocation } = useAppSelector((state) => state.locations);

  const { mapStyles } = useThemeContext();

  const [currentUserPosition, setCurrentUserPosition] = useState<GeoCoordinates | null>(null);

  const [showPopover, setShowPopover] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });

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
    if (selectedLocation?.address.geo.lat && selectedLocation?.address.geo.lng) {
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
    // restricted to viewport DE, CH, AUT
    restriction: {
      latLngBounds: {
        south: 45.75,
        west: 5.7,
        north: 55.15,
        east: 17.2,
      },
    },
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
  });

  const handleOpenLocationInfoModal = () => dispatch(showActions.setShowLocationInfoModal(true));

  const handleSetCurrentPosition = (value: GeoCoordinates | null) => setCurrentUserPosition(value);

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

  const handleShowCurrentUserPosition = () => {
    dispatch(
      mapActions.setCenter({
        lat: currentUserPosition!.lat,
        lng: currentUserPosition!.lng,
      })
    );
    dispatch(mapActions.zoomIn());
  };

  const locationsMarkers = useMemo(() => {
    const convertedLocations = locations.map((location: IceCreamLocation) => ({
      id: location._id,
      position: {
        lat: location.address.geo.lat!,
        lng: location.address.geo.lng!,
      },
      name: location.name,
      street: location.address.street,
      number: location.address.number,
    }));
    // filter out normal marker, when selected location exists
    return convertedLocations.filter(
      ({ position: { lat } }) => selectedLocation?.address.geo.lat !== lat
    );
  }, [selectedLocation, locations]);

  if (!isLoaded || !locations) return <Spinner />;

  return (
    <div className='containerMap'>
      <div className='control-left d-flex flex-column'>
        <IonButton
          className='zoomIcons'
          fill='clear'
          onClick={() => dispatch(mapActions.incrementZoom())}
        >
          <IonIcon icon={addCircleOutline} />
        </IonButton>
        <IonButton
          className='zoom-control-out zoomIcons'
          fill='clear'
          onClick={() => dispatch(mapActions.decreaseZoom())}
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
              dispatch(appActions.setConfirmMessageNewLocation('')); // remove message in case that user adds new location but never clicks on it
              dispatch(showActions.setShowSearchNewLocationModal(true));
            } else {
              event.persist();
              setShowPopover({ showPopover: true, event });
            }
          }}
          title='Neue Adresse hinzufügen'
        >
          <IonLabel className='me-1'>Neuer Laden</IonLabel>
          <IonIcon slot='start' icon={add} />
        </IonButton>
        <IonPopover
          cssClass='info-popover'
          event={showPopover.event}
          isOpen={showPopover.showPopover}
          onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
        >
          <PopoverContentNotRegistered />
        </IonPopover>

        <NewLocationSearchForm />

        <GeolocationButton
          currentUserPosition={currentUserPosition}
          handleSetCurrentPosition={handleSetCurrentPosition}
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
        center={center ?? defaultCenterPosition}
        options={options}
      >
        <MarkerClusterer
          options={clusterOptions}
          imageExtension='png'
          averageCenter={true}
          zoomOnClick={true}
        >
          {(clusterer) =>
            // @ts-ignore: Unreachable code error
            locationsMarkers.map(({ id, position, name, street, number }) => (
              <Marker
                key={id}
                position={position}
                clusterer={clusterer}
                icon={{
                  url: './assets/icons/ice-cream-icon-dark.svg',
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
                shape={{
                  coords: [1, 1, 1, 28, 26, 28, 26, 1],
                  type: 'poly',
                }}
                title={`${name}, ${street} ${number}`}
                cursor='pointer'
                onClick={() => {
                  dispatch(locationsActions.setSelectedLocation(id));
                  handleOpenLocationInfoModal();
                }}
                zIndex={1}
              />
            ))
          }
        </MarkerClusterer>

        {selectedLocation && (
          // Marker of ice cream location selected in searchbar
          <Marker
            position={{
              lat: selectedLocation.address.geo.lat as number,
              lng: selectedLocation.address.geo.lng as number,
            }}
            icon={{
              url: './assets/icons/selected-ice-location.svg',
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            title={`${selectedLocation.address.street} ${selectedLocation.address.number} ${selectedLocation.address.zipcode} ${selectedLocation.address.city}`}
            onClick={handleOpenLocationInfoModal}
            zIndex={2}
          />
        )}

        {currentUserPosition?.lat && currentUserPosition?.lng && (
          // Current position marker of user
          <Marker
            position={{
              lat: currentUserPosition.lat,
              lng: currentUserPosition.lng,
            }}
            icon={{
              url: './assets/icons/current-position-marker.svg',
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            onClick={handleShowCurrentUserPosition}
            zIndex={1}
          />
        )}

        {newLocation && (
          <>
            <Marker
              position={{
                lat: newLocation.address.geo.lat as number,
                lng: newLocation.address.geo.lng as number,
              }}
              icon={{
                url: './assets/icons/newLocation-marker.svg',
                scaledSize: new window.google.maps.Size(40, 40),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
              }}
              title={`${newLocation.address.street} ${newLocation.address.number} ${newLocation.address.zipcode} ${newLocation.address.city}`}
              cursor='pointer'
              onClick={() => {
                dispatch(appActions.setConfirmMessageNewLocation(''));
                dispatch(showActions.setShowAddNewLocationForm(true));
              }}
              zIndex={3}
            />
            <NewLocationForm />
          </>
        )}

        {selectedLocation && <LocationInfoModal selectedLocation={selectedLocation} />}
      </GoogleMap>

      {confirmMessageNewLocation && (
        <div className='message-new-location'>{confirmMessageNewLocation}</div>
      )}
    </div>
  );
};

export default EntdeckenMap;

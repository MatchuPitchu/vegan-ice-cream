import { useState, useEffect, VFC } from 'react';
// Redux Store
import { useAppDispatch } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { IonButton, IonIcon } from '@ionic/react';
import { close, navigateCircle, navigateCircleOutline } from 'ionicons/icons';
import LoadingError from './LoadingError';

interface GeoCoordinates {
  lat: number;
  lng: number;
}

interface Props {
  currentUserPosition: GeoCoordinates | null;
  handleSetCurrentPosition: (value: GeoCoordinates | null) => void;
}

const GeolocationButton: VFC<Props> = ({ currentUserPosition, handleSetCurrentPosition }) => {
  const dispatch = useAppDispatch();

  const [watchId, setWatchId] = useState<number | null>(null);
  const [centerCoord, setCenterCoord] = useState<GeoCoordinates[]>([]);

  useEffect(() => {
    if (centerCoord.length > 0) dispatch(mapActions.setCenter(centerCoord[0])); // center map to user position after click on button
  }, [centerCoord, dispatch]);

  const getPosition = () => {
    dispatch(appActions.setIsLoading(true));
    try {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          handleSetCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          // .some() tests whether at least one element in array is object and not null (because typeof item === 'object' returns also true when null)
          // first call setCenterCoord to current position, then array is no longer changed
          setCenterCoord((prev) =>
            prev.some((item) => typeof item === 'object' && item !== null)
              ? prev
              : [{ lat: position.coords.latitude, lng: position.coords.longitude }]
          );
        },
        (_) => {
          dispatch(
            appActions.setError(
              'Du hast keine Erlaubnis erteilt. Starte die App neu, um deine Eingabe neu zu setzen.'
            )
          );
          setTimeout(() => dispatch(appActions.resetError()), 5000);
        }
      );
      setWatchId(id);
    } catch (err) {
      console.log(err);
      dispatch(appActions.setError('Position kann nicht ermittelt werden. Berechtigung prüfen'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    dispatch(appActions.setIsLoading(false));
  };

  const removeWatch = () => {
    handleSetCurrentPosition(null);
    setCenterCoord([]);
    watchId && navigator.geolocation.clearWatch(watchId);
  };

  const handlePositionSearch = () => (currentUserPosition ? removeWatch() : getPosition());

  return (
    <IonButton
      className='where-control'
      onClick={handlePositionSearch}
      title={!currentUserPosition ? 'Eigenen Standort verfolgen' : 'Standortanzeige aus'}
    >
      <IonIcon icon={!currentUserPosition ? navigateCircleOutline : navigateCircle} />
      {currentUserPosition && (
        <IonIcon className='button--close-center-control' size='small' icon={close} />
      )}
    </IonButton>
  );
};

export default GeolocationButton;

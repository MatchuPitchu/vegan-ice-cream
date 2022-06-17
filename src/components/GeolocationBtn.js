import { useState, useEffect } from 'react';
// Redux Store
import { useAppDispatch } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { IonButton, IonIcon } from '@ionic/react';
import { close, navigateCircle, navigateCircleOutline } from 'ionicons/icons';
import LoadingError from './LoadingError';

const GeolocationBtn = ({ currentUserPosition, setCurrentUserPosition }) => {
  const dispatch = useAppDispatch();

  const [watchID, setWatchID] = useState(null);
  const [centerCoord, setCenterCoord] = useState([]);

  useEffect(() => {
    // setCenter to user position after first click on btn
    if (centerCoord.length) dispatch(mapActions.setCenter(centerCoord[0]));
  }, [centerCoord, dispatch]);

  const getPosition = () => {
    dispatch(appActions.setIsLoading(true));
    try {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
          // .some() tests whether at least one element in array is object and not null (because typeof item === 'object' returns also true when null)
          // first call setCenterCoord to currect position, after that, array is no longer changed
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
        },
        { useSignificantChanges: true }
      );
      setWatchID(id);
    } catch (err) {
      console.log(err);
      dispatch(appActions.setError('Position kann nicht ermittelt werden. Berechtigung prüfen'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    dispatch(appActions.setIsLoading(false));
  };

  const removeWatch = () => {
    setCurrentUserPosition(null);
    setCenterCoord([]);
    navigator.geolocation.clearWatch(watchID);
  };

  const handlePositionSearch = () => (currentUserPosition ? removeWatch() : getPosition());

  return (
    <>
      <IonButton
        className='where-control'
        onClick={handlePositionSearch}
        title={!currentUserPosition ? 'Eigenen Standort verfolgen' : 'Standortanzeige aus'}
      >
        <IonIcon icon={!currentUserPosition ? navigateCircleOutline : navigateCircle} />
        {currentUserPosition && <IonIcon className='close-center-btn' size='small' icon={close} />}
      </IonButton>

      <LoadingError />
    </>
  );
};

export default GeolocationBtn;

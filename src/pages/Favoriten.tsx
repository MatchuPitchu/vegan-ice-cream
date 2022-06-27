import { useState } from 'react';
import { useThemeContext } from '../context/ThemeContext';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userActions } from '../store/userSlice';
import { appActions } from '../store/appSlice';
import { getSelectedLocation, locationsActions } from '../store/locationsSlice';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonCard,
  IonIcon,
  IonButton,
  isPlatform,
  IonReorderGroup,
  IonReorder,
  IonItem,
} from '@ionic/react';
import { add, refreshCircle, reorderThreeOutline } from 'ionicons/icons';
import Spinner from '../components/Spinner';
import Ratings from '../components/Ratings';
import LocationInfoModal from '../components/LocationInfoModal';
import ButtonInfoRating from '../components/Comments/ButtonInfoRating';
import LocationInfoHeader from '../components/LocationInfoHeader';

const Favoriten = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.user);
  const selectedLocation = useAppSelector(getSelectedLocation);

  const { isDarkTheme } = useThemeContext();

  const [reorderDeactivated, setReorderDeactivated] = useState(true);
  const [rearranged, setRearranged] = useState(false);

  const handleRearrange = ({
    detail: { complete },
  }: {
    detail: { complete: (data?: boolean | any[]) => any };
  }) => {
    const rearrangedLocations = complete(user?.favorite_locations);
    dispatch(userActions.updateUser({ favorite_locations: rearrangedLocations }));
    setRearranged(true);
  };

  const onSubmit = async () => {
    dispatch(appActions.setIsLoading(true));

    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const options: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify({
          // extract only IDs of locations from array and save them in new array thanks to .map()
          updated_fav_list: user!.favorite_locations.map(({ _id }) => _id),
        }),
        credentials: 'include',
      };
      await fetch(`${process.env.REACT_APP_API_URL}/users/${user!._id}/update-fav-list`, options);
    } catch (err) {
      console.log(err);
      dispatch(appActions.setError('Da ist etwas schief gelaufen. Versuche es später nochmal.'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }

    setRearranged(false);
    dispatch(appActions.setIsLoading(false));
  };

  if (!user || !isAuth) {
    return (
      <IonPage>
        <Spinner />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <img
          className='headerMap'
          src={`${
            isDarkTheme
              ? './assets/header-favoriten-dark.svg'
              : './assets/header-favoriten-light.svg'
          }`}
          alt=''
        />
      </IonHeader>
      <IonContent>
        <IonCard
          className={`my-0 d-flex backgroundTransparent ${
            isPlatform('desktop') ? 'cardIonic' : ''
          }`}
        >
          <IonButton
            className={`ms-auto ${reorderDeactivated ? 'favReorderOff' : 'favReorderOn'}`}
            onClick={() => {
              setReorderDeactivated((prev) => !prev);
              rearranged && onSubmit(); // if user rearranged favorites list
            }}
          >
            <IonIcon
              className='me-1'
              icon={reorderDeactivated ? reorderThreeOutline : refreshCircle}
            />
            {reorderDeactivated ? 'Liste per Drag & Drop ordnen' : 'Neue Sortierung bestätigen'}
          </IonButton>
        </IonCard>

        <IonReorderGroup disabled={reorderDeactivated} onIonItemReorder={handleRearrange}>
          {user.favorite_locations.map((location, index) => (
            <IonCard key={location._id} className={`${isPlatform('desktop') ? 'cardIonic' : ''}`}>
              <IonButton className='favOrderNum'>{index + 1}.</IonButton>

              {!reorderDeactivated && (
                <IonItem className='reorderItem' lines='none'>
                  <IonReorder slot='end'>
                    <IonIcon icon={reorderThreeOutline} />
                  </IonReorder>
                </IonItem>
              )}

              <LocationInfoHeader location={location} />

              <div className='px-3 py-2'>
                {location.location_rating_quality ? (
                  <>
                    <Ratings
                      rating_vegan_offer={location.location_rating_vegan_offer as number}
                      rating_quality={location.location_rating_quality}
                      showNum={true}
                    />
                    <ButtonInfoRating location={location} />
                  </>
                ) : (
                  <IonButton
                    className='more-infos mt-1'
                    fill='solid'
                    onClick={() => dispatch(locationsActions.setSelectedLocation(location._id))}
                    routerLink='/bewerten'
                    routerDirection='forward'
                  >
                    <IonIcon icon={add} />
                    Erste Bewertung schreiben
                  </IonButton>
                )}
              </div>
            </IonCard>
          ))}
        </IonReorderGroup>

        {selectedLocation && <LocationInfoModal selectedLocation={selectedLocation} />}
      </IonContent>
    </IonPage>
  );
};

export default Favoriten;

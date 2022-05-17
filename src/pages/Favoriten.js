import { useContext, useState } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userActions } from '../store/userSlice';
import { selectedLocationActions } from '../store/selectedLocationSlice';
// Context
import { Context } from '../context/Context';
import { useThemeContext } from '../context/ThemeContext';
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
import LoadingError from '../components/LoadingError';
import Ratings from '../components/Ratings';
import SelectedMarker from '../components/SelectedMarker';
import BtnInfoRating from '../components/Comments/BtnInfoRating';
import LocInfoHeader from '../components/LocInfoHeader';

const Favoriten = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.user);
  const { selectedLocation } = useAppSelector((state) => state.selectedLocation);

  const { setLoading, setError, setOpenComments, setSearchSelected, setInfoModal } =
    useContext(Context);
  const { isDarkTheme } = useThemeContext();

  const [reorderDeactivated, setReorderDeactivated] = useState(true);
  const [rearranged, setRearranged] = useState(false);

  const doReorder = (e) => {
    const newOrder = e.detail.complete(user.favorite_locations);
    dispatch(userActions.updateUser({ favorite_locations: newOrder }));
    // setUser({
    //   ...user,
    //   favorite_locations: newOrder,
    // });
    setRearranged(true);
  };

  const onSubmit = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        // converts JS data into JSON string.
        body: JSON.stringify({
          // extract only IDs of locations from array and save them in new array thanks to .map()
          updated_fav_list: user.favorite_locations.map(({ _id }) => _id),
        }),
        credentials: 'include',
      };
      await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/update-fav-list`, options);
    } catch (err) {
      console.log(err);
      setError('Da ist etwas schief gelaufen. Versuche es später nochmal.');
      setTimeout(() => setError(null), 5000);
    }

    setRearranged(false);
    setLoading(false);
  };

  return isAuth && user ? (
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
              // if user rearranged fav list
              rearranged && onSubmit();
            }}
          >
            <IonIcon
              className='me-1'
              icon={reorderDeactivated ? reorderThreeOutline : refreshCircle}
            />
            {reorderDeactivated ? 'Liste per Drag & Drop ordnen' : 'Neue Sortierung bestätigen'}
          </IonButton>
        </IonCard>

        <IonReorderGroup disabled={reorderDeactivated} onIonItemReorder={doReorder}>
          {user.favorite_locations &&
            user.favorite_locations.map((loc, i) => (
              <IonCard key={loc._id} className={`${isPlatform('desktop') ? 'cardIonic' : ''}`}>
                <IonButton className='favOrderNum'>{i + 1}.</IonButton>

                {!reorderDeactivated && (
                  <IonItem className='reorderItem' lines='none'>
                    <IonReorder slot='end'>
                      <IonIcon icon={reorderThreeOutline} />
                    </IonReorder>
                  </IonItem>
                )}

                <LocInfoHeader loc={loc} />

                <div className='px-3 py-2'>
                  {loc.location_rating_quality ? (
                    <>
                      <Ratings
                        rating_vegan_offer={loc.location_rating_vegan_offer}
                        rating_quality={loc.location_rating_quality}
                        showNum={true}
                      />
                      <BtnInfoRating loc={loc} />
                    </>
                  ) : (
                    <IonButton
                      className='more-infos mt-1'
                      fill='solid'
                      onClick={() => {
                        setSearchSelected(loc);
                        setOpenComments(false);
                        dispatch(selectedLocationActions.resetSelectedLocation());
                        setInfoModal(false);
                      }}
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

        {selectedLocation ? <SelectedMarker /> : null}

        <LoadingError />
      </IonContent>
    </IonPage>
  ) : (
    <IonPage>
      <Spinner />
    </IonPage>
  );
};

export default Favoriten;

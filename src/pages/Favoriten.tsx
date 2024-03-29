import { useState } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userActions } from '../store/userSlice';
import { appActions } from '../store/appSlice';
import { ItemReorderEventDetail } from '@ionic/core';
import { IonCard, IonIcon, IonButton, IonReorderGroup, IonReorder } from '@ionic/react';
import { refreshCircleOutline, reorderThreeOutline } from 'ionicons/icons';
import Spinner from '../components/Spinner';
import CardContent from '../components/Card/CardContent';
import CardButtons from '../components/Card/CardRatingsAndButtons';
import PageWrapper from '../components/PageUtils/PageWrapper';
import Ratings from '../components/Ratings';

const Favoriten = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.user);

  const [reorderDeactivated, setReorderDeactivated] = useState(true);
  const [rearranged, setRearranged] = useState(false);

  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    if (user?.favorite_locations) {
      const items = [...user.favorite_locations]; // first shallow copy to avoid readonly error that state is directly mutated
      const rearrangedLocations = event.detail.complete(items);
      console.log(rearrangedLocations);
      dispatch(userActions.updateUser({ favorite_locations: rearrangedLocations }));
      setRearranged(true);
    }
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

  return (
    <PageWrapper
      srcHeaderImageLigth='./assets/header-favoriten-light.svg'
      srcHeaderImageDark='./assets/header-favoriten-dark.svg'
    >
      {!isAuth || !user ? (
        <Spinner />
      ) : (
        <div className='container-content--center'>
          <IonButton
            className={`my-3 mx-5 button--reorder ${
              reorderDeactivated ? 'button--reorder--off' : 'button--reorder--on'
            }`}
            onClick={() => {
              setReorderDeactivated((prev) => !prev);
              rearranged && onSubmit(); // if user rearranged favorites list
            }}
            expand='block'
          >
            <IonIcon
              className='pe-1'
              icon={reorderDeactivated ? reorderThreeOutline : refreshCircleOutline}
            />
            {reorderDeactivated ? 'Liste per Drag & Drop ordnen' : 'Neue Sortierung bestätigen'}
          </IonButton>

          <IonReorderGroup disabled={reorderDeactivated} onIonItemReorder={handleReorder}>
            {user.favorite_locations.map((location, index) => (
              <IonCard key={location._id} className='card card--list-favorites'>
                <div className='card__favorite-list-number'>{index + 1}</div>

                <div
                  className={`card__reorder-item ${
                    !reorderDeactivated && 'card__reorder-item--active'
                  }`}
                >
                  <IonReorder slot='end'>
                    <IonIcon icon={reorderThreeOutline} />
                  </IonReorder>
                </div>

                <CardContent location={location} />

                {location.location_rating_vegan_offer && location.location_rating_quality && (
                  <div className='px-3'>
                    <Ratings
                      rating_vegan_offer={location.location_rating_vegan_offer!}
                      rating_quality={location.location_rating_quality!}
                      showNum={true}
                    />
                  </div>
                )}

                <CardButtons
                  ratingVegan={location.location_rating_vegan_offer}
                  ratingQuality={location.location_rating_quality}
                  locationId={location._id}
                />
              </IonCard>
            ))}
          </IonReorderGroup>
        </div>
      )}
    </PageWrapper>
  );
};

export default Favoriten;

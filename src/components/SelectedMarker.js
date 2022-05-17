import { useContext, useEffect, useMemo } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectedLocationActions } from '../store/selectedLocationSlice';
// Context
import { Context } from '../context/Context';
import { useThemeContext } from '../context/ThemeContext';
import {
  IonButton,
  IonCard,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonModal,
  isPlatform,
} from '@ionic/react';
import {
  add,
  caretDownCircle,
  caretForwardCircle,
  closeCircleOutline,
  iceCream,
} from 'ionicons/icons';
import CommentsBlock from './Comments/CommentsBlock';
import BtnFavLoc from './Comments/BtnFavLoc';
import FlavorsBlock from './Comments/FlavorsBlock';
import Ratings from './Ratings';
import LoadingError from './LoadingError';
import Pricing from './Pricing';

const SelectedMarker = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { selectedLocation } = useAppSelector((state) => state.selectedLocation);

  const {
    setLoading,
    setError,
    setSearchSelected,
    openComments,
    setOpenComments,
    infoModal,
    setInfoModal,
    enterAnimation,
    leaveAnimation,
  } = useContext(Context);
  const { isDarkTheme } = useThemeContext();

  useEffect(() => {
    // no need to fetch if no comments ids available or if detailed comments already fetched
    if (selectedLocation.comments_list.length === 0 || selectedLocation.comments_list[0].text)
      return;

    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/locations/${selectedLocation._id}/all-comments-flavors`
        );
        const { comments_list, flavors_listed } = await res.json();
        dispatch(
          selectedLocationActions.updateSelectedLocation({
            comments_list,
            flavors_listed,
          })
        );
      } catch (err) {
        console.log(err);
        setError('Ups, schief gelaufen. Versuche es später nochmal.');
        setTimeout(() => setError(null), 5000);
      }
    };
    fetchData();
    setLoading(false);
  }, [selectedLocation, setError, setLoading, dispatch]);

  return (
    <IonModal
      cssClass='mapModal'
      isOpen={infoModal}
      swipeToClose={true}
      backdropDismiss={true}
      onDidDismiss={() => {
        setOpenComments(false);
        dispatch(selectedLocationActions.resetSelectedLocation());
        setInfoModal(false);
      }}
      enterAnimation={enterAnimation}
      leaveAnimation={leaveAnimation}
    >
      <IonItem lines='full'>
        <IonLabel>{selectedLocation.name}</IonLabel>
        {user ? <BtnFavLoc selectedLoc={selectedLocation} /> : null}
        <IonButton
          className='hoverTransparentBtn'
          fill='clear'
          onClick={() => {
            setOpenComments(false);
            dispatch(selectedLocationActions.resetSelectedLocation());
            setInfoModal(false);
          }}
        >
          <IonIcon icon={closeCircleOutline} />
        </IonButton>
      </IonItem>

      <IonContent>
        {/* IonImg uses lazy loading */}
        <IonImg
          className='modalImage'
          src='./assets/images/ice-cream-chocolate-sm-mae-mu-unsplash.jpg'
        />

        <div
          style={isDarkTheme ? { backgroundColor: '#23303399' } : { backgroundColor: '#ffffff99' }}
        >
          <IonItemGroup>
            <IonItem className='modalItem' lines='full'>
              <IonLabel className='ion-text-wrap'>
                {selectedLocation.address.street} {selectedLocation.address.number}
                <br />
                {selectedLocation.address.zipcode} {selectedLocation.address.city}
                <br />
                <a
                  className='websiteLink'
                  href={
                    selectedLocation.location_url.includes('http')
                      ? selectedLocation.location_url
                      : `//${selectedLocation.location_url}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {selectedLocation.location_url}
                </a>
              </IonLabel>
              {selectedLocation.pricing.length > 0 && <Pricing loc={selectedLocation} />}
            </IonItem>

            <IonItem
              button
              onClick={() => {
                setSearchSelected(selectedLocation);
                setOpenComments(false);
                dispatch(selectedLocationActions.resetSelectedLocation());
                setInfoModal(false);
              }}
              routerLink='/preis'
              routerDirection='forward'
              className='modalItemSmall itemTextSmall'
              lines='full'
              detail='false'
            >
              <IonLabel>
                {selectedLocation.pricing.length === 0
                  ? 'Kugelpreis eintragen'
                  : 'Kugelpreis aktualisieren'}
              </IonLabel>
              <IonButton fill='clear'>
                <IonIcon icon={add} />
              </IonButton>
            </IonItem>

            <IonItem
              button
              onClick={() => {
                setSearchSelected(selectedLocation);
                setOpenComments(false);
                dispatch(selectedLocationActions.resetSelectedLocation());
                setInfoModal(false);
              }}
              routerLink='/bewerten'
              routerDirection='forward'
              className='modalItemSmall itemTextSmall'
              lines='full'
              detail='false'
            >
              <IonLabel>Bewerten</IonLabel>
              <IonButton fill='clear'>
                <IonIcon icon={add} />
              </IonButton>
            </IonItem>
          </IonItemGroup>
        </div>

        <IonCard className={`${isPlatform('desktop') ? 'cardIonic' : ''}`}>
          <div style={{ backgroundColor: 'var(--ion-item-background)' }}>
            {selectedLocation.comments_list.length ? (
              <IonItemGroup>
                <div className='px-3 py-1 borderBottom'>
                  <Ratings
                    rating_vegan_offer={selectedLocation.location_rating_vegan_offer}
                    rating_quality={selectedLocation.location_rating_quality}
                    showNum={true}
                  />
                </div>

                {selectedLocation.comments_list[0] && (
                  <>
                    <IonItem
                      color='background-color'
                      className={`${!openComments && 'borderBottom'}`}
                      lines='none'
                    >
                      <IonIcon
                        className='me-2'
                        color='primary'
                        icon={openComments ? caretDownCircle : caretForwardCircle}
                        button
                        onClick={() => {
                          setOpenComments((prev) => !prev);
                        }}
                      />
                      <IonLabel>Bewertungen</IonLabel>
                      <IonButton
                        fill='solid'
                        className='commentNum'
                        onClick={() => setOpenComments((prev) => !prev)}
                      >
                        {selectedLocation.comments_list.length}
                      </IonButton>
                    </IonItem>

                    {openComments
                      ? selectedLocation.comments_list.map((comment) => (
                          <CommentsBlock comment={comment} key={comment._id} />
                        ))
                      : null}

                    <IonItem lines='none'>
                      <IonIcon className='me-2' color='primary' icon={iceCream} />
                      <IonLabel>Bewertete Eissorten</IonLabel>
                    </IonItem>

                    <FlavorsBlock flavorsList={selectedLocation.flavors_listed} />
                  </>
                )}
              </IonItemGroup>
            ) : (
              <IonItem
                button
                onClick={() => {
                  setSearchSelected(selectedLocation);
                  setOpenComments(false);
                  dispatch(selectedLocationActions.resetSelectedLocation());
                  setInfoModal(false);
                }}
                routerLink='/bewerten'
                routerDirection='forward'
                className='itemTextSmall'
                lines='none'
                detail='false'
              >
                ... wartet auf die erste Bewertung
              </IonItem>
            )}
          </div>
        </IonCard>

        <LoadingError />
      </IonContent>
    </IonModal>
  );
};

export default SelectedMarker;

import { useEffect, VFC } from 'react';
import type { IceCreamLocation } from '../types/types';
import { isComment, isCommentsList } from '../types/typeguards';
import { useThemeContext } from '../context/ThemeContext';
import { useAnimation } from '../hooks/useAnimation';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
import { appActions } from '../store/appSlice';
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
import ButtonFavoriteLocation from './Comments/ButtonFavoriteLocation';
import FlavorsList from './Comments/FlavorsList';
import Ratings from './Ratings';
import LoadingError from './LoadingError';
import Pricing from './Pricing';

type Props = {
  selectedLocation: IceCreamLocation;
};

const LocationInfoModal: VFC<Props> = ({ selectedLocation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { showComments, showLocationInfoModal } = useAppSelector((state) => state.app);

  const { enterAnimationFromBottom, leaveAnimationToBottom } = useAnimation();

  const { isDarkTheme } = useThemeContext();

  useEffect(() => {
    if (selectedLocation.comments_list.length === 0) return; // no comments available
    if (isComment(selectedLocation.comments_list[0])) return; // comment already fetched

    dispatch(appActions.setIsLoading(true));
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/locations/${selectedLocation._id}/all-comments-flavors`
        );
        const { comments_list, flavors_listed } = await res.json();
        dispatch(
          locationsActions.updateSelectedLocation({
            comments_list,
            flavors_listed,
          })
        );
      } catch (err) {
        console.log(err);
        dispatch(appActions.setError('Ups, schief gelaufen. Versuche es später nochmal.'));
        setTimeout(() => dispatch(appActions.resetError()), 5000);
      }
    };
    fetchData();
    dispatch(appActions.setIsLoading(false));
  }, [selectedLocation, dispatch]);

  const handleResetAllOnCloseModal = () => {
    dispatch(appActions.closeCommentsAndLocationInfoModal());
    dispatch(locationsActions.resetSelectedLocation());
  };

  const handleResetExceptSelectedLocationOnCloseModal = () => {
    dispatch(appActions.closeCommentsAndLocationInfoModal());
  };

  return (
    <IonModal
      cssClass='map-modal'
      isOpen={showLocationInfoModal}
      swipeToClose={true}
      backdropDismiss={true}
      onDidDismiss={handleResetAllOnCloseModal}
      enterAnimation={enterAnimationFromBottom}
      leaveAnimation={leaveAnimationToBottom}
    >
      <IonItem lines='full'>
        <IonLabel>{selectedLocation.name}</IonLabel>
        {user && <ButtonFavoriteLocation location={selectedLocation} />}
        <IonButton
          className='hoverTransparentBtn'
          fill='clear'
          onClick={handleResetAllOnCloseModal}
        >
          <IonIcon icon={closeCircleOutline} />
        </IonButton>
      </IonItem>

      <IonContent>
        {/* IonImg uses lazy isLoading */}
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
              {selectedLocation.pricing.length > 0 && (
                <Pricing pricing={selectedLocation.pricing} />
              )}
            </IonItem>

            <IonItem
              button
              onClick={handleResetExceptSelectedLocationOnCloseModal}
              routerLink='/preis'
              routerDirection='forward'
              className='modalItemSmall itemTextSmall'
              lines='full'
              detail={false}
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
              onClick={handleResetExceptSelectedLocationOnCloseModal}
              routerLink='/bewerten'
              routerDirection='forward'
              className='modalItemSmall itemTextSmall'
              lines='full'
              detail={false}
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
            {selectedLocation.comments_list.length > 0 ? (
              <IonItemGroup>
                <div className='px-3 py-1 borderBottom'>
                  <Ratings
                    rating_vegan_offer={selectedLocation.location_rating_vegan_offer}
                    rating_quality={selectedLocation.location_rating_quality}
                    showNum={true}
                  />
                </div>

                <IonItem
                  color='background-color'
                  className={`${!showComments && 'borderBottom'}`}
                  lines='none'
                >
                  <IonIcon
                    className='me-2'
                    color='primary'
                    icon={showComments ? caretDownCircle : caretForwardCircle}
                    onClick={() => dispatch(appActions.toggleShowComments())}
                  />
                  <IonLabel>Bewertungen</IonLabel>
                  <IonButton
                    fill='solid'
                    className='commentNum'
                    onClick={() => dispatch(appActions.toggleShowComments())}
                  >
                    {selectedLocation.comments_list.length}
                  </IonButton>
                </IonItem>

                {showComments &&
                  isCommentsList(selectedLocation.comments_list) &&
                  selectedLocation.comments_list.map((comment) => (
                    <CommentsBlock
                      key={comment._id}
                      comment={comment}
                      authorIdOfComment={comment.user_id._id}
                    />
                  ))}

                <IonItem lines='none'>
                  <IonIcon className='me-2' color='primary' icon={iceCream} />
                  <IonLabel>Bewertete Eissorten</IonLabel>
                </IonItem>

                <FlavorsList flavorsList={selectedLocation.flavors_listed} />
              </IonItemGroup>
            ) : (
              <IonItem
                button
                onClick={handleResetExceptSelectedLocationOnCloseModal}
                routerLink='/bewerten'
                routerDirection='forward'
                className='itemTextSmall'
                lines='none'
                detail={false}
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

export default LocationInfoModal;

import { useState, VFC } from 'react';
import type { IceCreamLocation } from '../types/types';
import { isComment, isCommentsList, isString } from '../types/typeguards';
import { useThemeContext } from '../context/ThemeContext';
import { useAnimation } from '../hooks/useAnimation';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
import { showActions } from '../store/showSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetCommentsAndFlavorsOfSelectedLocationQuery } from '../store/api/locations-api-slice';
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
  addCircleSharp,
  caretDownCircle,
  caretForwardCircle,
  closeCircleOutline,
  iceCream,
  removeCircleSharp,
  starHalfOutline,
} from 'ionicons/icons';
import CommentsBlock from './Comments/CommentsBlock';
import ButtonFavoriteLocation from './Comments/ButtonFavoriteLocation';
import FlavorsList from './Comments/FlavorsList';
import Ratings from './Ratings';
import Pricing from './Pricing';
import PricingForm from './PricingForm';

type Props = {
  selectedLocation: IceCreamLocation;
};

const LocationInfoModal: VFC<Props> = ({ selectedLocation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { showComments, showLocationInfoModal } = useAppSelector((state) => state.show);

  const [isPricingFormOpen, setIsPricingFormOpen] = useState(false);

  const { enterAnimationFromBottom, leaveAnimationToBottom } = useAnimation();

  const { isDarkTheme } = useThemeContext();

  // if no comments available OR comments already fetched, set locationId to null to skip fetching
  const locationId =
    selectedLocation.comments_list.length === 0 || isComment(selectedLocation.comments_list[0])
      ? skipToken // skipToken skips the fetching
      : selectedLocation._id;

  const { isLoading, error, isSuccess } =
    useGetCommentsAndFlavorsOfSelectedLocationQuery(locationId);

  const handleResetAllOnCloseModal = () => {
    dispatch(showActions.closeCommentsAndLocationInfoModal());
    dispatch(locationsActions.resetSelectedLocation());
  };

  const handleResetExceptSelectedLocationOnCloseModal = () => {
    dispatch(showActions.closeCommentsAndLocationInfoModal());
  };

  const handleTogglePricingForm = () => {
    setIsPricingFormOpen((prev) => !prev);
  };

  const handleToggleShowComments = () => dispatch(showActions.toggleShowComments());

  return (
    <IonModal
      cssClass='map-modal'
      isOpen={showLocationInfoModal}
      swipeToClose={true}
      backdropDismiss={true}
      onDidDismiss={handleResetExceptSelectedLocationOnCloseModal}
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
            <IonItem className='item-transparent item-transparent--large' lines='full'>
              <IonLabel className='ion-text-wrap'>
                {selectedLocation.address.street} {selectedLocation.address.number}
                <br />
                {selectedLocation.address.zipcode} {selectedLocation.address.city}
                <br />
                <a
                  className='link--website'
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
              onClick={handleTogglePricingForm}
              className='item-transparent--small item-text--small'
              lines='full'
              detail={false}
            >
              <IonLabel>
                {selectedLocation.pricing.length === 0
                  ? 'Kugelpreis eintragen'
                  : 'Kugelpreis aktualisieren'}
              </IonLabel>
              <IonButton fill='clear'>
                <IonIcon icon={isPricingFormOpen ? removeCircleSharp : addCircleSharp} />
              </IonButton>
            </IonItem>
            {isPricingFormOpen && (
              <IonItem
                className='item-transparent--small item-text--small'
                lines='full'
                detail={false}
              >
                <PricingForm onFinishUpdatePricing={handleTogglePricingForm} />
              </IonItem>
            )}

            <IonItem
              button
              onClick={handleResetExceptSelectedLocationOnCloseModal}
              routerLink='/bewerten'
              routerDirection='forward'
              className='item-transparent--small item-text--small'
              lines='full'
              detail={false}
            >
              <IonLabel>Bewerten</IonLabel>
              <IonButton fill='clear'>
                <IonIcon icon={starHalfOutline} />
              </IonButton>
            </IonItem>
          </IonItemGroup>
        </div>

        <IonCard className={`${isPlatform('desktop') ? 'card--ionic' : ''}`}>
          <div style={{ backgroundColor: 'var(--ion-item-background)' }}>
            {selectedLocation.comments_list.length > 0 ? (
              <IonItemGroup>
                <IonItem lines='full'>
                  <Ratings
                    rating_vegan_offer={selectedLocation.location_rating_vegan_offer as number}
                    rating_quality={selectedLocation.location_rating_quality as number}
                    showNum={true}
                  />
                </IonItem>

                <IonItem
                  color='background-color'
                  className={`${!showComments && 'border-bottom'}`}
                  lines='none'
                >
                  <IonIcon
                    className='me-2'
                    color='primary'
                    icon={showComments ? caretDownCircle : caretForwardCircle}
                    onClick={handleToggleShowComments}
                  />
                  <IonLabel>Bewertungen</IonLabel>
                  <IonButton fill='solid' className='commentNum' onClick={handleToggleShowComments}>
                    {selectedLocation.comments_list.length}
                  </IonButton>
                </IonItem>

                {showComments &&
                  isCommentsList(selectedLocation.comments_list) &&
                  selectedLocation.comments_list.map((comment) => (
                    <CommentsBlock
                      key={comment._id}
                      comment={comment}
                      // TODO: Vereinheitlichen -> ID in Profil = comment.user_id; ID in SelectedLocation = comment.user_id._id
                      authorIdOfComment={
                        isString(comment.user_id) ? comment.user_id : comment.user_id._id
                      }
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
                className='item-text--small'
                lines='none'
                detail={false}
              >
                ... wartet auf die erste Bewertung
              </IonItem>
            )}
          </div>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default LocationInfoModal;

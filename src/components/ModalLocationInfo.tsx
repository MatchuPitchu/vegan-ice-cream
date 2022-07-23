import { useState, VFC } from 'react';
import type { Comment } from '../types/types';
import { isComment, isCommentsList, isString } from '../types/typeguards';
import { useAnimation } from '../hooks/useAnimation';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getSelectedLocation, locationsActions } from '../store/locationsSlice';
import { showActions } from '../store/showSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetCommentsAndFlavorsOfSelectedLocationQuery } from '../store/api/locations-api-slice';
import {
  IonButton,
  IonCard,
  IonContent,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonModal,
  isPlatform,
} from '@ionic/react';
import {
  addCircleSharp,
  caretDownCircleOutline,
  caretForwardCircleOutline,
  closeCircleOutline,
  iceCreamOutline,
  removeCircleSharp,
  starHalfOutline,
} from 'ionicons/icons';
import CommentsBlock from './Comments/CommentsBlock';
import ButtonFavoriteLocation from './Comments/ButtonFavoriteLocation';
import FlavorsList from './Comments/FlavorsList';
import Ratings from './Ratings';
import Pricing from './Pricing';
import PricingForm from './PricingForm';
import AddressBlock from './Card/AddressBlock';
import WebsiteBlock from './Card/WebsiteBlock';

const ModalLocationInfo: VFC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const selectedLocation = useAppSelector(getSelectedLocation);
  const { showComments, showLocationInfoModal } = useAppSelector((state) => state.show);

  const [isPricingFormOpen, setIsPricingFormOpen] = useState(false);

  const { enterAnimationFromBottom, leaveAnimationToBottom } = useAnimation();

  let locationId: string | typeof skipToken = skipToken; // skipToken skips fetching
  let shouldFetch: boolean = false;

  if (selectedLocation) {
    // if comments available or every comment was already fetched, set locationId for data fetching
    shouldFetch =
      selectedLocation.comments_list.length > 0 &&
      (selectedLocation.comments_list as (Comment | string)[]).some(
        (item: Comment | string) => !isComment(item)
      );

    locationId = shouldFetch ? selectedLocation._id : skipToken;
  }

  const { refetch } = useGetCommentsAndFlavorsOfSelectedLocationQuery(locationId);

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

  const handleToggleShowComments = () => {
    dispatch(showActions.toggleShowComments());
    shouldFetch && refetch();
  };

  return (
    selectedLocation && (
      <IonModal
        cssClass='modal'
        isOpen={showLocationInfoModal}
        swipeToClose={true}
        backdropDismiss={true}
        onDidDismiss={handleResetExceptSelectedLocationOnCloseModal}
        enterAnimation={enterAnimationFromBottom}
        leaveAnimation={leaveAnimationToBottom}
      >
        <IonItem lines='full'>
          <IonLabel className='label--bold'>{selectedLocation.name}</IonLabel>
          {user && <ButtonFavoriteLocation location={selectedLocation} />}
          <IonButton
            className='button--hover-transparent'
            fill='clear'
            onClick={handleResetAllOnCloseModal}
          >
            <IonIcon icon={closeCircleOutline} />
          </IonButton>
        </IonItem>

        <IonContent>
          <img
            className='modal__image'
            src='./assets/images/ice-cream-chocolate-sm-mae-mu-unsplash.jpg'
            alt='ice cream cone'
          />
          <IonItemGroup className='background-with-opacity'>
            <IonItem className='item--transparent item--transparent-large' lines='full'>
              <IonLabel className='ion-text-wrap'>
                {selectedLocation?.address && <AddressBlock address={selectedLocation.address} />}
                {selectedLocation?.location_url && (
                  <WebsiteBlock url={selectedLocation.location_url} />
                )}
              </IonLabel>
              {selectedLocation.pricing.length > 0 && (
                <Pricing pricing={selectedLocation.pricing} />
              )}
            </IonItem>

            <IonItem
              button
              onClick={handleTogglePricingForm}
              className='item--transparent-small item-text--small'
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
                className='item--transparent-small item-text--small'
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
              className='item--transparent-small item-text--small'
              lines='full'
              detail={false}
            >
              <IonLabel>Bewerten</IonLabel>
              <IonButton fill='clear'>
                <IonIcon icon={starHalfOutline} />
              </IonButton>
            </IonItem>
          </IonItemGroup>

          <IonCard className={`${isPlatform('desktop') ? 'card--ionic' : ''}`}>
            <div style={{ backgroundColor: 'var(--ion-item-background)' }}>
              {selectedLocation.comments_list.length > 0 ? (
                <IonItemGroup>
                  <IonItem lines='inset'>
                    <Ratings
                      rating_vegan_offer={selectedLocation.location_rating_vegan_offer as number}
                      rating_quality={selectedLocation.location_rating_quality as number}
                      showNum={true}
                    />
                  </IonItem>

                  <IonItem lines={`${!showComments ? 'inset' : 'none'}`}>
                    <IonIcon
                      color='primary'
                      className={`me-2 ${
                        showComments ? 'icon--rotate90Forward' : 'icon--rotateBack'
                      }`}
                      icon={caretForwardCircleOutline}
                      onClick={handleToggleShowComments}
                    />
                    <IonLabel>Bewertungen</IonLabel>
                    <div className='comment__number' onClick={handleToggleShowComments}>
                      {selectedLocation.comments_list.length}
                    </div>
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
                    <IonIcon
                      className='me-2 icon--rotateForward'
                      color='primary'
                      icon={iceCreamOutline}
                    />
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
                  ... erste Bewertung schreiben
                </IonItem>
              )}
            </div>
          </IonCard>
        </IonContent>
      </IonModal>
    )
  );
};

export default ModalLocationInfo;

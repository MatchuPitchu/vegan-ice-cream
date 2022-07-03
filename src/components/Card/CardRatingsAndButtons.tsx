import { VFC } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { locationsActions } from '../../store/locationsSlice';
import { IonButton, IonIcon } from '@ionic/react';
import { informationCircleOutline, starHalfOutline } from 'ionicons/icons';
import Ratings from '../Ratings';
import { showActions } from '../../store/showSlice';

interface Props {
  ratingVegan: number | null;
  ratingQuality: number | null;
  locationId: string;
}

const CardRatingsAndButtons: VFC<Props> = ({ ratingVegan, ratingQuality, locationId }) => {
  const dispatch = useAppDispatch();

  const selectLocation = () => {
    dispatch(locationsActions.setSelectedLocation(locationId));
  };

  return (
    <div className='px-3 py-1'>
      {ratingVegan && ratingQuality && (
        <>
          <Ratings rating_vegan_offer={ratingVegan} rating_quality={ratingQuality} showNum={true} />
          <div className='button-group'>
            <IonButton
              className='button--check'
              fill='clear'
              onClick={() => {
                selectLocation();
                dispatch(showActions.setShowLocationInfoModal(true));
              }}
            >
              <IonIcon slot='end' icon={informationCircleOutline} />
              Mehr Infos
            </IonButton>
            <IonButton
              className='button--check'
              fill='clear'
              onClick={() => selectLocation()}
              routerLink='/bewerten'
              routerDirection='forward'
            >
              <IonIcon slot='end' icon={starHalfOutline} />
              Bewerten
            </IonButton>
          </div>
        </>
      )}

      {!ratingQuality && (
        <IonButton
          className='button--check button--check-large'
          fill='clear'
          expand='block'
          onClick={() => selectLocation()}
          routerLink='/bewerten'
          routerDirection='forward'
        >
          <IonIcon slot='end' icon={starHalfOutline} />
          Erste Bewertung schreiben
        </IonButton>
      )}
    </div>
  );
};

export default CardRatingsAndButtons;

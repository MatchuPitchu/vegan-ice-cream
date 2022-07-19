import { useContext, VFC } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { locationsActions } from '../../store/locationsSlice';
import { IonIcon, NavContext } from '@ionic/react';
import { informationCircleOutline, mapOutline, starHalfOutline } from 'ionicons/icons';
import { showActions } from '../../store/showSlice';

interface Props {
  ratingVegan: number | null;
  ratingQuality: number | null;
  locationId: string;
}

const CardButtons: VFC<Props> = ({ ratingVegan, ratingQuality, locationId }) => {
  const { navigate } = useContext(NavContext);

  const dispatch = useAppDispatch();

  const selectLocation = () => dispatch(locationsActions.setSelectedLocation(locationId));

  const hasRatings = ratingVegan && ratingQuality;

  return (
    <>
      {hasRatings && (
        <div className='button-group button-group--locations-list'>
          <button
            className='button--locations-list'
            onClick={() => {
              selectLocation();
              dispatch(showActions.setShowLocationInfoModal(true));
            }}
          >
            <IonIcon aria-label='Info' size='small' icon={informationCircleOutline} />
          </button>
          <button
            className='button--locations-list'
            onClick={() => {
              selectLocation();
              navigate('/entdecken', 'forward');
            }}
          >
            <IonIcon aria-label='auf Karte zeigen' size='small' icon={mapOutline} />
          </button>
          <button
            className='button--locations-list'
            onClick={() => {
              selectLocation();
              navigate('/bewerten', 'forward');
            }}
          >
            <IonIcon aria-label='Bewerten' size='small' icon={starHalfOutline} />
          </button>
        </div>
      )}

      {!hasRatings && (
        <div className='button-group button-group--locations-list'>
          <button
            className='button--locations-list button--check-large'
            onClick={() => {
              selectLocation();
              navigate('/bewerten', 'forward');
            }}
          >
            Erste Bewertung schreiben
          </button>
        </div>
      )}
    </>
  );
};

export default CardButtons;

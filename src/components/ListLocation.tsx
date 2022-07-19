import { VFC, useContext } from 'react';
import { NavContext } from '@ionic/react';
import type { IceCreamLocation } from '../types/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showActions } from '../store/showSlice';
import { locationsActions } from '../store/locationsSlice';
import { IonCard, IonIcon, IonItem, IonLabel } from '@ionic/react';
import Pricing from './Pricing';
import ButtonFavoriteLocation from './Comments/ButtonFavoriteLocation';
import Ratings from './Ratings';
import { informationCircleOutline, mapOutline, starHalfOutline } from 'ionicons/icons';

interface Props {
  location: IceCreamLocation;
  number: number;
}

const ListLocation: VFC<Props> = ({ location, number }) => {
  const { navigate } = useContext(NavContext);

  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.user);

  const selectLocation = () => dispatch(locationsActions.setSelectedLocation(location._id));

  const hasRatings = location.location_rating_vegan_offer && location.location_rating_quality;

  return (
    <IonCard className='card card--list-result'>
      <div className='card__favorite-list-number card__favorite-list-number--result-list'>
        {number}
      </div>

      <IonItem lines='none'>
        <IonLabel className='ion-text-wrap'>
          <div className='card-content__title--list-result'>{location.name}</div>
          {location.address.city && <div className='address'>{location.address.city}</div>}
        </IonLabel>

        {location.pricing.length > 0 && (
          <Pricing pricing={location.pricing} className='pricing-indication--position-normal' />
        )}

        {user && <ButtonFavoriteLocation location={location} />}
      </IonItem>

      {hasRatings && (
        <div className='px-3'>
          <Ratings
            rating_vegan_offer={location.location_rating_vegan_offer!}
            rating_quality={location.location_rating_quality!}
            showNum={true}
          />
        </div>
      )}

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
    </IonCard>
  );
};

export default ListLocation;

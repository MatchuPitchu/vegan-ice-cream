import { VFC } from 'react';
import type { IceCreamLocation } from '../types/types';
import { useAppSelector } from '../store/hooks';
import { IonCard, IonItem, IonLabel } from '@ionic/react';
import Pricing from './Pricing';
import ButtonFavoriteLocation from './Comments/ButtonFavoriteLocation';
import Ratings from './Ratings';
import CardButtons from './Card/CardRatingsAndButtons';

interface Props {
  location: IceCreamLocation;
  number: number;
}

const ListLocation: VFC<Props> = ({ location, number }) => {
  const { user } = useAppSelector((state) => state.user);

  const hasRatings = location.location_rating_vegan_offer && location.location_rating_quality;

  return (
    <IonCard className='card card--list-result'>
      <div className='card__favorite-list-number'>{number}</div>

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

      <CardButtons
        ratingVegan={location.location_rating_vegan_offer!}
        ratingQuality={location.location_rating_quality!}
        locationId={location._id}
      />
    </IonCard>
  );
};

export default ListLocation;

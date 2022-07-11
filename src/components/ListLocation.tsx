import { VFC } from 'react';
import type { IceCreamLocation } from '../types/types';
import { IonCard } from '@ionic/react';
import CardContent from './Card/CardContent';
import CardRatingsAndButtons from './Card/CardRatingsAndButtons';
import Pricing from './Pricing';

interface Props {
  location: IceCreamLocation;
  number: number;
}

const ListLocation: VFC<Props> = ({ location, number }) => {
  return (
    <IonCard className='card card--list-result'>
      {location.pricing.length > 0 && (
        <Pricing pricing={location.pricing} className='pricing-indication--position-relative' />
      )}

      <CardContent location={location} />

      <div className='card__favorite-list-number'>{number}</div>

      <CardRatingsAndButtons
        ratingVegan={location.location_rating_vegan_offer}
        ratingQuality={location.location_rating_quality}
        locationId={location._id}
      />
    </IonCard>
  );
};

export default ListLocation;

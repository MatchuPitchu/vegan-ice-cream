import { VFC } from 'react';
import type { IceCreamLocation } from '../types/types';
import { IonCard, isPlatform } from '@ionic/react';
import CardContent from './Card/CardContent';
import CardRatingsAndButtons from './Card/CardRatingsAndButtons';

interface Props {
  location: IceCreamLocation;
}

const ListResultComponent: VFC<Props> = ({ location }) => {
  return (
    <IonCard className={`${isPlatform('desktop') ? 'card--ionic' : ''}`}>
      <CardContent location={location} />

      <CardRatingsAndButtons
        ratingVegan={location.location_rating_vegan_offer}
        ratingQuality={location.location_rating_quality}
        locationId={location._id}
      />
    </IonCard>
  );
};

export default ListResultComponent;

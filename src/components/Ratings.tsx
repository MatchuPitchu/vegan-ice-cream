import { IonButton } from '@ionic/react';
import { VFC } from 'react';
import RatingReadonly from './FormFields/RatingReadonly';

type Props = {
  rating_vegan_offer: number;
  rating_quality: number;
  showNum: boolean;
};

const Ratings: VFC<Props> = ({ rating_vegan_offer, rating_quality, showNum }) => {
  return (
    <div className='rating-container'>
      <div className='rating rating--only-show'>
        <div>Veganes Angebot</div>
        <RatingReadonly initialValue={rating_vegan_offer} />
        {showNum ? (
          <IonButton disabled fill='solid' className='rating__number'>
            {rating_vegan_offer}
          </IonButton>
        ) : (
          <span />
        )}
        <div>Eis-Erlebnis</div>
        <RatingReadonly initialValue={rating_quality} />
        {showNum ? (
          <IonButton disabled fill='solid' className='rating__number'>
            {rating_quality}
          </IonButton>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

export default Ratings;

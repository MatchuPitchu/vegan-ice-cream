import { IonButton } from '@ionic/react';
import { VFC } from 'react';
import RatingOnlyShow from './FormFields/RatingDisplay';

type Props = {
  rating_vegan_offer: number;
  rating_quality: number;
  showNum: boolean;
};

const Ratings: VFC<Props> = ({ rating_vegan_offer, rating_quality, showNum }) => {
  return (
    <div className='d-flex align-items-center py-1 itemTextSmall'>
      <div className='rating rating--only-show'>
        <div>Veganes Angebot</div>
        <RatingOnlyShow initialValue={rating_vegan_offer} />
        {showNum ? (
          <IonButton disabled fill='solid' className='rating__number'>
            {rating_vegan_offer}
          </IonButton>
        ) : (
          <span></span>
        )}
        <div>Eis-Erlebnis</div>
        <RatingOnlyShow initialValue={rating_quality} />
        {showNum ? (
          <IonButton disabled fill='solid' className='rating__number'>
            {rating_quality}
          </IonButton>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export default Ratings;

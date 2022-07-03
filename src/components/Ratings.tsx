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
        <div className='rating__category'>Veganes Angebot</div>
        <RatingReadonly initialValue={rating_vegan_offer} />
        {showNum ? <div className='rating__number'>{rating_vegan_offer}</div> : <span />}
        <div className='rating__category'>Eis-Erlebnis</div>
        <RatingReadonly initialValue={rating_quality} />
        {showNum ? <div className='rating__number'>{rating_quality}</div> : <span />}
      </div>
    </div>
  );
};

export default Ratings;

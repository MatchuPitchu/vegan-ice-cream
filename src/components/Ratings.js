import { IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import ReactStars from 'react-rating-stars-component';

const Ratings = ({ rating_vegan_offer, rating_quality, showNum }) => {
  const [starsVegan, setStarsVegan] = useState(2);
  const [starsQuality, setStarsQuality] = useState(2);

  useEffect(() => {
    setStarsVegan(rating_vegan_offer);
    setStarsQuality(rating_quality);
  }, [rating_vegan_offer, rating_quality]);

  return (
    <div className='d-flex align-items-center py-1 itemTextSmall'>
      <div className='me-2'>
        <div className='ratingContainer'>Veganes Angebot</div>
        <div className='ratingContainer'>Eis-Erlebnis</div>
      </div>
      <div>
        <ReactStars
          className='react-stars'
          count={5}
          value={starsVegan}
          isHalf={true}
          edit={false}
          size={18}
          color1='#cccccc90'
          color2='var(--ion-color-primary)'
        />
        <ReactStars
          className='react-stars'
          count={5}
          value={starsQuality}
          isHalf={true}
          edit={false}
          size={18}
          color1='#cccccc90'
          color2='var(--ion-color-primary)'
        />
      </div>

      {/* Showing rating numbers only in overview rating for every location */}
      {showNum && (
        <div className='ms-auto d-flex flex-column'>
          <IonButton disabled fill='solid' className='ratingNum'>
            {rating_vegan_offer}
          </IonButton>
          <IonButton disabled fill='solid' className='ratingNum'>
            {rating_quality}
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default Ratings;

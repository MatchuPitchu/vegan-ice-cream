import { VFC } from 'react';
import type { IceCreamLocation } from '../../types/types';
// Redux Store
import { useAppSelector } from '../../store/hooks';
import { getSelectedLocation } from '../../store/locationsSlice';
import {
  isPlatform,
  IonSlide,
  IonCard,
  IonLabel,
  IonSlides,
  IonItem,
  IonButton,
} from '@ionic/react';
import LocationInfoModal from '../LocationInfoModal';
import Pricing from '../Pricing';
import CardRatingsAndButtons from '../Card/CardRatingsAndButtons';
import CardContent from '../Card/CardContent';

interface Props {
  topLocationsInCity: IceCreamLocation[];
  hideTopLocations: boolean;
}

const TopLocationsSlider: VFC<Props> = ({ topLocationsInCity, hideTopLocations }) => {
  const selectedLocation = useAppSelector(getSelectedLocation);

  const slideOptions = {
    initialSlide: 0,
    speed: 400,
  };

  return (
    <IonSlides
      hidden={hideTopLocations}
      key={topLocationsInCity[0]._id} // key important, otherwise IonSlides is breaking: https://github.com/ionic-team/ionic-framework/issues/18782
      className={`${isPlatform('desktop') ? 'slider--desktop' : 'slider--mobile'}`}
      pager={true}
      options={slideOptions}
    >
      {topLocationsInCity.map((location: IceCreamLocation, index: number) => (
        <IonSlide key={location._id} className='text-start'>
          <div className='slider_card-container'>
            <IonCard className={`card ${isPlatform('desktop') ? 'card--ionic' : ''}`}>
              {location.pricing.length > 0 && (
                <Pricing
                  pricing={location.pricing}
                  className='pricing-indication--position-relative'
                />
              )}

              <div className='card__favorite-list-number'>{index + 1}</div>

              <CardContent showAvatar={false} location={location} />

              <CardRatingsAndButtons
                ratingVegan={location.location_rating_vegan_offer}
                ratingQuality={location.location_rating_quality}
                locationId={location._id}
              />
            </IonCard>
          </div>

          {selectedLocation && <LocationInfoModal selectedLocation={selectedLocation} />}
        </IonSlide>
      ))}
    </IonSlides>
  );
};

export default TopLocationsSlider;

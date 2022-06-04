import { VFC } from 'react';
import type { IceCreamLocation } from '../../types';
// Redux Store
import { useAppSelector } from '../../store/hooks';
// Context
import {
  isPlatform,
  IonSlide,
  IonCard,
  IonLabel,
  IonSlides,
  IonItem,
  IonButton,
} from '@ionic/react';
import SelectedMarker from '../SelectedMarker';
import Ratings from '../Ratings';
import BtnInfoRating from '../Comments/BtnInfoRating';
import Pricing from '../Pricing';

interface Props {
  topLocations: IceCreamLocation[];
  hideTopLocations: boolean;
}

const TopLocationsSlider: VFC<Props> = ({ topLocations, hideTopLocations }) => {
  const { selectedLocation } = useAppSelector((state) => state.selectedLocation);

  const slideOptions = {
    initialSlide: 0,
    speed: 400,
  };

  return (
    <IonSlides
      hidden={hideTopLocations}
      key={topLocations[0]._id} // key important, otherwise IonSlides is breaking: https://github.com/ionic-team/ionic-framework/issues/18782
      className={`${isPlatform('desktop') ? 'slideDesktop' : 'slideMobile'}`}
      pager={true}
      options={slideOptions}
    >
      {topLocations.map((location: IceCreamLocation, index: number) => (
        <IonSlide key={location._id} className='text-start'>
          <div className='slideCardContainer'>
            <IonButton className='slideBtn'>{index + 1}.</IonButton>
            <IonCard className='slideCard'>
              <IonItem lines='full'>
                <IonLabel className='ion-text-wrap'>
                  {location.name}
                  <p>
                    {location.address.street} {location.address.number}
                  </p>
                  <p className='mb-1'>
                    {location.address.zipcode} {location.address.city}
                  </p>
                  {location.location_url && (
                    <p>
                      <a
                        className='websiteLink'
                        href={
                          location.location_url.includes('http')
                            ? location.location_url
                            : `//${location.location_url}`
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {location.location_url}
                      </a>
                    </p>
                  )}
                </IonLabel>
                {location.pricing.length > 0 && <Pricing pricing={location.pricing} />}
              </IonItem>
              <div className='px-3 py-2'>
                {location.location_rating_quality && (
                  <>
                    <Ratings
                      rating_vegan_offer={location.location_rating_vegan_offer}
                      rating_quality={location.location_rating_quality}
                      showNum={true}
                    />
                    <BtnInfoRating location={location} />
                  </>
                )}
              </div>
            </IonCard>
          </div>

          {selectedLocation && <SelectedMarker />}
        </IonSlide>
      ))}
    </IonSlides>
  );
};

export default TopLocationsSlider;

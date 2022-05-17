// Redux Store
import { useAppSelector } from '../store/hooks';
// Context
import { useContext } from 'react';
import { Context } from '../context/Context';
import {
  isPlatform,
  IonSlide,
  IonCard,
  IonLabel,
  IonSlides,
  IonItem,
  IonButton,
} from '@ionic/react';
import SelectedMarker from './SelectedMarker';
import Ratings from './Ratings';
import BtnInfoRating from './Comments/BtnInfoRating';
import Pricing from './Pricing';

// Optional parameters to pass to the swiper instance.
// See http://idangero.us/swiper/api/ for valid options.

const TopLocations = () => {
  const { selectedLocation } = useAppSelector((state) => state.selectedLocation);

  const { topLocations, showTopLoc } = useContext(Context);

  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  return (
    <IonSlides
      hidden={showTopLoc ? false : true}
      // key important, otherwise IonSlides is breaking: https://github.com/ionic-team/ionic-framework/issues/18782
      key={topLocations[0]._id}
      className={`${isPlatform('desktop') ? 'slideDesktop' : 'slideMobile'}`}
      pager={true}
      options={slideOpts}
    >
      {topLocations.map((loc, i) => (
        <IonSlide key={loc._id} className='text-start'>
          <div className='slideCardContainer'>
            <IonButton className='slideBtn'>{i + 1}.</IonButton>
            <IonCard className='slideCard'>
              <IonItem lines='full'>
                <IonLabel className='ion-text-wrap'>
                  {loc.name}
                  <p>
                    {loc.address.street} {loc.address.number}
                  </p>
                  <p className='mb-1'>
                    {loc.address.zipcode} {loc.address.city}
                  </p>
                  {loc.location_url && (
                    <p>
                      <a
                        className='websiteLink'
                        href={
                          loc.location_url.includes('http')
                            ? loc.location_url
                            : `//${loc.location_url}`
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {loc.location_url}
                      </a>
                    </p>
                  )}
                </IonLabel>
                {loc.pricing.length > 0 && <Pricing loc={loc} />}
              </IonItem>
              <div className='px-3 py-2'>
                {loc.location_rating_quality && (
                  <>
                    <Ratings
                      rating_vegan_offer={loc.location_rating_vegan_offer}
                      rating_quality={loc.location_rating_quality}
                      showNum={true}
                    />
                    <BtnInfoRating loc={loc} />
                  </>
                )}
              </div>
            </IonCard>
          </div>

          {selectedLocation ? <SelectedMarker /> : null}
        </IonSlide>
      ))}
    </IonSlides>
  );
};

export default TopLocations;

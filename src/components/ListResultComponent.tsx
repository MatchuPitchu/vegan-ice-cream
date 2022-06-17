import { VFC } from 'react';
import type { IceCreamLocation } from '../types/types';
// Redux Store
import { useAppDispatch } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
import { IonButton, IonCard, IonIcon, isPlatform } from '@ionic/react';
import { add } from 'ionicons/icons';
import Ratings from './Ratings';
import BtnInfoRating from './Comments/BtnInfoRating';
import LocInfoHeader from './LocInfoHeader';

interface Props {
  location: IceCreamLocation;
}

const ListResultComponent: VFC<Props> = ({ location }) => {
  const dispatch = useAppDispatch();

  return (
    <IonCard className={`${isPlatform('desktop') ? 'cardIonic' : ''}`}>
      <LocInfoHeader location={location} />

      <div className='px-3 py-2'>
        {location.location_rating_quality ? (
          <>
            <Ratings
              rating_vegan_offer={location.location_rating_vegan_offer as number}
              rating_quality={location.location_rating_quality as number}
              showNum={true}
            />
            <BtnInfoRating location={location} />
          </>
        ) : (
          <IonButton
            className='more-infos mt-1'
            onClick={() => dispatch(locationsActions.setSelectedLocation(location._id))}
            fill='solid'
            routerLink='/bewerten'
            routerDirection='forward'
          >
            <IonIcon icon={add} />
            Erste Bewertung schreiben
          </IonButton>
        )}
      </div>
    </IonCard>
  );
};

export default ListResultComponent;

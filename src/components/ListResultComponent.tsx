// Redux Store
import { useAppDispatch } from '../store/hooks';
import { selectedLocationActions } from '../store/selectedLocationSlice';
// Context
import { useContext, VFC } from 'react';
import { Context } from '../context/Context';
import { IonButton, IonCard, IonIcon, isPlatform } from '@ionic/react';
import { add } from 'ionicons/icons';
import Ratings from './Ratings';
import BtnInfoRating from './Comments/BtnInfoRating';
import LocInfoHeader from './LocInfoHeader';
import type { IceCreamLocation } from '../types';

interface Props {
  location: IceCreamLocation;
}

const ListResultComponent: VFC<Props> = ({ location }) => {
  const dispatch = useAppDispatch();

  const { setInfoModal, setOpenComments } = useContext(Context);

  return (
    <IonCard className={`${isPlatform('desktop') ? 'cardIonic' : ''}`}>
      <LocInfoHeader location={location} />

      <div className='px-3 py-2'>
        {location.location_rating_quality ? (
          <>
            <Ratings
              rating_vegan_offer={location.location_rating_vegan_offer}
              rating_quality={location.location_rating_quality}
              showNum={true}
            />
            <BtnInfoRating location={location} />
          </>
        ) : (
          <IonButton
            className='more-infos mt-1'
            onClick={() => {
              dispatch(selectedLocationActions.setSelectedLocation(location));
              setOpenComments(false);
              setInfoModal(false);
            }}
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

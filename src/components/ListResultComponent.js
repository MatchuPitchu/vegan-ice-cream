import { useContext } from 'react';
import { Context } from '../context/Context';
import { IonButton, IonCard, IonIcon, isPlatform } from '@ionic/react';
import { add } from 'ionicons/icons';
import Ratings from './Ratings';
import BtnInfoRating from './Comments/BtnInfoRating';
import LocInfoHeader from './LocInfoHeader';

const ListResultComponent = ({ loc }) => {
  const { setSelected, setSearchSelected, setInfoModal, setOpenComments } = useContext(Context);

  return (
    <IonCard className={`${isPlatform('desktop') ? 'cardIonic' : ''}`}>
      <LocInfoHeader loc={loc} />

      <div className='px-3 py-2'>
        {loc.location_rating_quality ? (
          <>
            <Ratings
              rating_vegan_offer={loc.location_rating_vegan_offer}
              rating_quality={loc.location_rating_quality}
              showNum={true}
            />
            <BtnInfoRating loc={loc} />
          </>
        ) : (
          <IonButton
            className='more-infos mt-1'
            onClick={() => {
              setSearchSelected(loc);
              setOpenComments(false);
              setSelected(null);
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

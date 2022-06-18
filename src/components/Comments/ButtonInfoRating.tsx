import { VFC } from 'react';
import type { IceCreamLocation } from '../../types/types';
// Redux Store
import { useAppDispatch } from '../../store/hooks';
import { locationsActions } from '../../store/locationsSlice';
import { IonButton, IonIcon } from '@ionic/react';
import { add, open } from 'ionicons/icons';
import { showActions } from '../../store/showSlice';

interface Props {
  location: IceCreamLocation;
}

const ButtonInfoRating: VFC<Props> = ({ location }) => {
  const dispatch = useAppDispatch();

  const selectLocation = () => {
    dispatch(locationsActions.setSelectedLocation(location._id));
  };

  return (
    <div className='text-center mt-1'>
      <IonButton
        className='more-infos mt-1'
        title='Mehr Infos'
        fill='solid'
        onClick={() => {
          selectLocation();
          dispatch(showActions.setShowLocationInfoModal(true));
        }}
      >
        <IonIcon className='me-1' icon={open} />
        Mehr Infos
      </IonButton>
      <IonButton
        className='more-infos mt-1'
        onClick={() => selectLocation()}
        fill='solid'
        routerLink='/bewerten'
        routerDirection='forward'
      >
        <IonIcon icon={add} />
        Bewerten
      </IonButton>
    </div>
  );
};

export default ButtonInfoRating;

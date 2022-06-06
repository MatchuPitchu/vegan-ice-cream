import { VFC } from 'react';
import type { IceCreamLocation } from '../../types';
// Redux Store
import { useAppDispatch } from '../../store/hooks';
import { selectedLocationActions } from '../../store/selectedLocationSlice';
import { appActions } from '../../store/appSlice';
import { IonButton, IonIcon } from '@ionic/react';
import { add, open } from 'ionicons/icons';

interface Props {
  location: IceCreamLocation;
}

const BtnInfoRating: VFC<Props> = ({ location }) => {
  const dispatch = useAppDispatch();

  return (
    <div className='text-center mt-1'>
      <IonButton
        className='more-infos mt-1'
        title='Mehr Infos'
        fill='solid'
        onClick={() => {
          dispatch(selectedLocationActions.setSelectedLocation(location));
          dispatch(appActions.setShowLocationInfoModal(true));
        }}
      >
        <IonIcon className='me-1' icon={open} />
        Mehr Infos
      </IonButton>
      <IonButton
        className='more-infos mt-1'
        onClick={() => dispatch(selectedLocationActions.setSelectedLocation(location))}
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

export default BtnInfoRating;

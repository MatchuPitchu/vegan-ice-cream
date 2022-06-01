import { useContext, VFC } from 'react';
import type { IceCreamLocation } from '../../types';
// Redux Store
import { useAppDispatch } from '../../store/hooks';
// Context
import { Context } from '../../context/Context';
import { IonButton, IonIcon } from '@ionic/react';
import { add, open } from 'ionicons/icons';
import { selectedLocationActions } from '../../store/selectedLocationSlice';

interface Props {
  location: IceCreamLocation;
}

const BtnInfoRating: VFC<Props> = ({ location }) => {
  const dispatch = useAppDispatch();

  const { setOpenComments, setInfoModal } = useContext(Context);

  return (
    <div className='text-center mt-1'>
      <IonButton
        className='more-infos mt-1'
        title='Mehr Infos'
        fill='solid'
        onClick={() => {
          setOpenComments(false);
          dispatch(selectedLocationActions.setSelectedLocation(location));
          setInfoModal(true);
        }}
      >
        <IonIcon className='me-1' icon={open} />
        Mehr Infos
      </IonButton>
      <IonButton
        className='more-infos mt-1'
        onClick={() => {
          setOpenComments(false);
          dispatch(selectedLocationActions.setSelectedLocation(location));
          setInfoModal(false);
        }}
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

// Redux Store
import { useAppDispatch } from '../../store/hooks';
// Context
import { useContext } from 'react';
import { Context } from '../../context/Context';
import { IonButton, IonIcon } from '@ionic/react';
import { add, open } from 'ionicons/icons';
import { selectedLocationActions } from '../../store/selectedLocationSlice';

const BtnInfoRating = ({ loc }) => {
  const dispatch = useAppDispatch();

  const { setSearchSelected, setOpenComments, setInfoModal } = useContext(Context);

  return (
    <div className='text-center mt-1'>
      <IonButton
        className='more-infos mt-1'
        title='Mehr Infos'
        fill='solid'
        onClick={() => {
          setOpenComments(false);
          dispatch(selectedLocationActions.updateSelectedLocation(loc));
          setInfoModal(true);
        }}
      >
        <IonIcon className='me-1' icon={open} />
        Mehr Infos
      </IonButton>
      <IonButton
        className='more-infos mt-1'
        onClick={() => {
          setSearchSelected(loc);
          setOpenComments(false);
          dispatch(selectedLocationActions.resetSelectedLocationt());
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

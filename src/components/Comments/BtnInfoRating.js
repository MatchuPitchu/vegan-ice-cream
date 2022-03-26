import { useContext } from 'react';
import { Context } from '../../context/Context';
import { IonButton, IonIcon } from '@ionic/react';
import { add, open } from 'ionicons/icons';

const BtnInfoRating = ({ loc }) => {
  const { setSelected, setSearchSelected, setOpenComments, setInfoModal } = useContext(Context);

  return (
    <div className='text-center mt-1'>
      <IonButton
        className='more-infos mt-1'
        title='Mehr Infos'
        fill='solid'
        onClick={() => {
          setOpenComments(false);
          setSelected(loc);
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
          setSelected(null);
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

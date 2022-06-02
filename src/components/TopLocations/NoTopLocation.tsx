import { useContext, VFC } from 'react';
import { Context } from '../../context/Context';
import { IonCard, IonIcon } from '@ionic/react';
import { star } from 'ionicons/icons';

const NoTopLocation: VFC = () => {
  const { cityName } = useContext(Context);

  return (
    <div className='container text-center'>
      <IonCard>
        <div className='noTopLocCard'>
          Noch keine Top Eisläden mit 3+
          <IonIcon size='small' color='primary' icon={star} />
          <br />
          in <span className='highlightSpan'>{cityName}</span> gefunden.
          <br />
        </div>
      </IonCard>
    </div>
  );
};

export default NoTopLocation;

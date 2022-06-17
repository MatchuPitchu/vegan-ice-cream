import { VFC } from 'react';
import { IonCard, IonIcon } from '@ionic/react';
import { star } from 'ionicons/icons';

interface Props {
  cityName: string;
}

const NoTopLocation: VFC<Props> = ({ cityName }) => {
  return (
    <div className='container-content--center'>
      <IonCard className='noTopLocCard'>
        Noch keine Top Eisläden mit 3+
        <IonIcon size='small' color='primary' icon={star} />
        <br />
        in <span className='highlightSpan'>{cityName}</span> gefunden.
      </IonCard>
    </div>
  );
};

export default NoTopLocation;

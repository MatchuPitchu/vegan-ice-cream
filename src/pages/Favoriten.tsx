import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import Geocoding from '../components/Geocoding';

const Favoriten: React.FC = () => {
  return (
    <IonPage>
      <Geocoding />
    </IonPage>
  );
};

export default Favoriten;

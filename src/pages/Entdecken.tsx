import { VFC } from 'react';
// Redux Store
import { IonPage } from '@ionic/react';
import Search from '../components/Search';
import EntdeckenMap from '../components/EntdeckenMap';

const Entdecken: VFC = () => {
  return (
    <IonPage>
      <Search />
      <EntdeckenMap />
    </IonPage>
  );
};

export default Entdecken;

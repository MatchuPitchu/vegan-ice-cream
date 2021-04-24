import { IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline } from 'ionicons/icons';
import Toggle from './Toggle';

const Menu: React.FC = () => {
  return (
    <>
      <IonToolbar color="primary">
        <div className='text-center'>Einstellungen</div>
      </IonToolbar>

      <IonHeader>
        <IonList>
          <IonListHeader>
            Einstellungen
          </IonListHeader>
          <IonItem>
            <IonLabel>Auswahl Farbschema</IonLabel>
            <Toggle />
          </IonItem>
        </IonList>
      </IonHeader>
    </>
  );
};

export default Menu;
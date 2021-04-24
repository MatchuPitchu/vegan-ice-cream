import { IonApp, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, menu } from 'ionicons/icons';
import { menuController } from '@ionic/core';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonApp>
    {/* <IonMenu content-id="main-content" >
      <IonToolbar color="primary">
        <IonTitle>Menu</IonTitle>
      </IonToolbar>

    <IonContent>
      <IonList>
        <IonListHeader>
          Navigate
        </IonListHeader>
        <IonMenuToggle auto-hide="false">
          <IonItem>
            <IonIcon slot="start" icon={homeOutline}></IonIcon>
            <IonLabel>
              Home
            </IonLabel>
          </IonItem>
        </IonMenuToggle>
      </IonList>
    </IonContent>
  </IonMenu>

  <IonPage className="ion-page" id="main-content">
        <IonButtons slot="start">

            <IonButton onClick={ async () => await menuController.toggle()}>
              <IonIcon slot="icon-only" icon={menu} />
            </IonButton>

        </IonButtons>
  </IonPage> */}
  </IonApp>
  );
};

export default Tab2;

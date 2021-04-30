import { useContext } from 'react';
import { Context } from "../context/Context";
import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenuToggle, IonNote, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { create, logIn, mailOpen } from 'ionicons/icons';
import Toggle from './Toggle';



const Menu: React.FC = () => {
  const { toggle } = useContext(Context);
  
  return (
    <IonContent>
      <IonToolbar color="primary">
        <div className='text-center'>Einstellungen</div>
      </IonToolbar>
      <IonList id="inbox-list">
        <IonItem className="labelMenu pe-2" lines="none">
          <IonLabel >Farbstil</IonLabel>
          <Toggle />
        </IonItem>
        <IonListHeader>
          <img className="headerGraphic" src={`${toggle ? "./assets/header-graphic-ice-dark.svg" : "./assets/header-graphic-ice-light.svg"}`} />
        </IonListHeader>
        <IonMenuToggle autoHide={false}>
          <IonItem className="labelMenu pe-2" routerLink='/login' routerDirection="none" lines="none" detail={false}>
            <IonLabel>Login</IonLabel>
            <IonIcon icon={logIn} />
          </IonItem>
        </IonMenuToggle>
        <IonMenuToggle autoHide={false}>
          <IonItem className="labelMenu pe-2" routerLink='/register' routerDirection="none" lines="none" detail={false}>
            <IonLabel>Anmelden</IonLabel>
            <IonIcon icon={create} />
          </IonItem>
        </IonMenuToggle>
        <IonItem className="labelMenu pe-2" lines="none">
          <IonLabel >Feedback</IonLabel>
          <IonIcon icon={mailOpen} />
        </IonItem>
      </IonList>
    </IonContent>
  );
};

export default Menu;
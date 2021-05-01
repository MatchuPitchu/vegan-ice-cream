import { useContext, useState } from 'react';
import { Context } from "../context/Context";
import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenuToggle, IonNav, IonNote, IonPage, IonText, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { create, logIn } from 'ionicons/icons';
import Toggle from './Toggle';
import Feedback from './Feedback';

import IonReactNav from '../components/IonReactNav';
import { IonReactRouter } from '@ionic/react-router';

const Menu: React.FC = () => {
  const { isAuth, setIsAuth, error, setError, toggle } = useContext(Context);
  const [ openForm, setOpenForm] = useState(false);

  return (
    <IonPage>
      <IonReactRouter>
        <IonReactNav detail={() => <Feedback />}>
          <IonContent fullscreen>
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
                <IonItem className="labelMenu pe-2" routerLink='/login' routerDirection="none" lines="none" detail={false} >
                  <IonLabel>Login</IonLabel>
                  <IonIcon icon={logIn} />
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle autoHide={false}>
                <IonItem className="labelMenu pe-2" routerLink='/register' routerDirection="none" lines="full" detail={false}>
                  <IonLabel>Anmelden</IonLabel>
                  <IonIcon icon={create} />
                </IonItem>
              </IonMenuToggle>
              {/* NOCHMAL SCHAUEN UND LIEBER MIT MODAL ÖFFNEN WIE AUF MAP ARBEITEN ANSTELLE VON IonReactNav COMPONENT */}
              <IonItem button className="ion-react-nav-detail-btn labelMenu pe-2" onClick={() => {}} lines="none">
                <IonLabel color="primary">Feedback</IonLabel>
              </IonItem>           
            </IonList>
          </IonContent>
        </IonReactNav>
      </IonReactRouter>
    </IonPage>
  );
};

export default Menu;
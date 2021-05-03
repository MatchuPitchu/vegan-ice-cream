import { useContext } from 'react';
import { Context } from "../context/Context";
import { 
  IonButton, 
  IonContent, 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonList, 
  IonListHeader, 
  IonMenuToggle, 
  IonModal, 
  IonPage, 
  IonToolbar,
  isPlatform 
} from '@ionic/react';
import { closeCircleOutline, create, logIn, logOut, pencil, personCircle } from 'ionicons/icons';
import Toggle from './Toggle';
import Feedback from './Feedback';

const Menu: React.FC = () => {
  const { isAuth, setIsAuth, error, setError, toggle, enterAnimationLft, leaveAnimationLft, showModal, setShowModal } = useContext(Context);

  return (
    <IonPage>
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
              <IonItem className="labelMenu"  disabled={isAuth ? true : false} routerLink='/login' routerDirection="forward" lines="none" detail={false} >
                <IonLabel>Login</IonLabel>
                <IonIcon slot="end" icon={logIn} />
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle autoHide={false}>
            <IonItem className="labelMenu" disabled={isAuth ? true : false} routerLink='/register' routerDirection="forward" lines="none" detail={false}>
                <IonLabel>Registrieren</IonLabel>
                <IonIcon slot="end" icon={create} />
              </IonItem>
            </IonMenuToggle>
            {isAuth && (
            <IonMenuToggle autoHide={false}>
              <IonItem className="labelMenu" routerLink='/profil' routerDirection="forward" lines="full" detail={false}>
                <IonLabel>Profil</IonLabel>
                <IonIcon slot="end" icon={personCircle} />
              </IonItem>
            </IonMenuToggle>
            )}
            <IonItem className="labelMenu" button onClick={() => { setShowModal(true)}}  lines={isAuth ? "full" : "none"} detail={false} >
              <IonLabel>Feedback</IonLabel>
              <IonIcon slot="end" icon={pencil} />
            </IonItem>
            {showModal && (
              <IonModal cssClass={`${isPlatform('desktop') ? 'menuModalDesktop' : 'menuModal'}`} isOpen={showModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowModal(false)} enterAnimation={enterAnimationLft} leaveAnimation={leaveAnimationLft}>
                <IonItem lines="none">
                  <IonLabel color="primary" >Feedback</IonLabel>
                  <IonButton slot="end" fill="clear" onClick={() => setShowModal(false)}><IonIcon icon={closeCircleOutline}/></IonButton>
                </IonItem>
                <Feedback />
              </IonModal>
            )}      
            {isAuth && (
              <IonMenuToggle autoHide={false}>
              <IonItem className="labelMenu mt-5 pe-2" routerLink='/logout' routerDirection="forward" lines="none" detail={false}>
                <IonIcon slot="start" icon={logOut} />
                <IonLabel>Logout</IonLabel>
              </IonItem>
            </IonMenuToggle>
            )}
          </IonList>
        </IonContent>
    </IonPage>
  );
};

export default Menu;
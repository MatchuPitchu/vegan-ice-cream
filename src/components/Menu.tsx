import { useContext } from 'react';
import { Context } from "../context/Context";
import { 
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
import { create, informationCircle, logIn, logOut, pencil, personCircle } from 'ionicons/icons';
import Toggle from './Toggle';
import Feedback from './Feedback';
import About from './About';
import Profil from './Profil';

const Menu: React.FC = () => {
  const {
    setUser,
    isAuth, setIsAuth, 
    toggle,
    enterAnimationLft, leaveAnimationLft, 
    showProfil, setShowProfil,
    showFeedback, setShowFeedback, 
    showAbout, setShowAbout
  } = useContext(Context);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    setUser(null);
  }

  return (
    <IonPage>
      <IonToolbar color="primary">
        <div className='text-center'>Einstellungen</div>
      </IonToolbar>
      <IonContent fullscreen>
        <IonList id="inbox-list">
          <IonItem className="labelMenu pe-2" lines="none">
            <IonLabel >Farbstil</IonLabel>
            <Toggle />
          </IonItem>
          <IonListHeader>
            <img className="headerGraphic" src={`${toggle ? "./assets/header-graphic-ice-dark.svg" : "./assets/header-graphic-ice-light.svg"}`} />
          </IonListHeader>
          <IonItem className="labelMenu" disabled={isAuth ? true : false} routerLink='/login' lines="none" detail={false} >
            <IonLabel>Login</IonLabel>
            <IonIcon slot="end" icon={logIn} />
          </IonItem>
          <IonItem className="labelMenu" disabled={isAuth ? true : false} routerLink='/register' lines="none" detail={false}>
            <IonLabel>Registrieren</IonLabel>
            <IonIcon slot="end" icon={create} />
          </IonItem>
          {isAuth && (
            <IonItem className="labelMenu" button onClick={() => { setShowProfil(true)}} lines="full" detail={false}>
              <IonLabel>Profil</IonLabel>
              <IonIcon slot="end" icon={personCircle} />
            </IonItem>
          )}
          {showProfil && (
            <IonModal cssClass={`${isPlatform('desktop') ? 'menuModalDesktop' : 'menuModal'}`} isOpen={showProfil} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowProfil(false)} enterAnimation={enterAnimationLft} leaveAnimation={leaveAnimationLft}>
              <Profil />
            </IonModal>
          )}      
          <IonItem className="labelMenu" button onClick={() => { setShowFeedback(true)}} lines="none" detail={false} >
            <IonLabel>Feedback</IonLabel>
            <IonIcon slot="end" icon={pencil} />
          </IonItem>
          {showFeedback && (
            <IonModal cssClass={`${isPlatform('desktop') ? 'menuModalDesktop' : 'menuModal'}`} isOpen={showFeedback} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowFeedback(false)} enterAnimation={enterAnimationLft} leaveAnimation={leaveAnimationLft}>
              <Feedback />
            </IonModal>
          )}      
          <IonItem className="labelMenu" button onClick={() => { setShowAbout(true)}}  lines={isAuth ? "full" : "none"} detail={false} >
            <IonLabel>About</IonLabel>
            <IonIcon slot="end" icon={informationCircle} />
          </IonItem>
          {showAbout && (
            <IonModal cssClass={`${isPlatform('desktop') ? 'menuModalDesktop' : 'menuModal'}`} isOpen={showAbout} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowAbout(false)} enterAnimation={enterAnimationLft} leaveAnimation={leaveAnimationLft}>
              <About />
            </IonModal>
          )}      
          {isAuth && (
            <IonItem button onClick={logout} className="labelMenu mt-3 pe-2" routerLink='/logout' lines="none" detail={false}>
              <IonIcon slot="start" icon={logOut} />
              <IonLabel>Logout</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Menu;
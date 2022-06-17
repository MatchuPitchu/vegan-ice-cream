// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userActions } from '../store/userSlice';
import { showActions } from '../store/showSlice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import { useAnimation } from '../hooks/useAnimation';
import { menuController } from '@ionic/core';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonToolbar,
  isPlatform,
} from '@ionic/react';
import {
  create,
  informationCircle,
  lockClosed,
  logIn,
  logOut,
  pencil,
  personCircle,
} from 'ionicons/icons';
import SwitchTheme from './SwitchTheme';
import Feedback from './Feedback';
import About from './About';
import Profil from './Profil';

const Menu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.user);
  const { showProfil, showFeedback, showAbout } = useAppSelector((state) => state.show);
  const { successMsg } = useAppSelector((state) => state.app);

  const { isDarkTheme } = useThemeContext();
  const { enterAnimationFromLeft, leaveAnimationToLeft } = useAnimation();

  const handleLogout = () => dispatch(userActions.logout());

  return (
    <IonPage>
      <IonToolbar color='primary'>
        <div className='text-center'>Einstellungen</div>
      </IonToolbar>
      <IonContent fullscreen>
        <IonList id='inbox-list'>
          <IonItem className='labelMenu pe-2' lines='none'>
            <IonLabel>Farbstil</IonLabel>
            <SwitchTheme />
          </IonItem>
          <IonListHeader>
            <img
              className='headerGraphic'
              src={`${
                isDarkTheme
                  ? './assets/header-graphic-ice-dark-2.svg'
                  : './assets/header-graphic-ice-light-2.svg'
              }`}
              alt='Header App'
            />
          </IonListHeader>
          <IonItem
            className='labelMenu'
            disabled={isAuth ? true : false}
            routerLink='/login'
            lines='none'
            detail={false}
            button
            onClick={async () => await menuController.toggle()}
          >
            <IonLabel>Login</IonLabel>
            <IonIcon slot='end' icon={logIn} />
          </IonItem>
          <IonItem
            className='labelMenu'
            disabled={isAuth ? true : false}
            routerLink='/register'
            lines='none'
            detail={false}
            button
            onClick={async () => await menuController.toggle()}
          >
            <IonLabel>Registrieren</IonLabel>
            <IonIcon slot='end' icon={create} />
          </IonItem>

          {isAuth && (
            <IonItem
              className='labelMenu'
              button
              onClick={() => dispatch(showActions.setShowProfil(true))}
              lines='full'
              detail={false}
            >
              <IonLabel>Profil</IonLabel>
              <IonIcon slot='end' icon={personCircle} />
            </IonItem>
          )}
          {showProfil && (
            <IonModal
              cssClass={`${isPlatform('desktop') ? 'menuModalDesktop' : 'menuModal'}`}
              isOpen={showProfil}
              swipeToClose={true}
              backdropDismiss={true}
              onDidDismiss={() => dispatch(showActions.setShowProfil(false))}
              enterAnimation={enterAnimationFromLeft}
              leaveAnimation={leaveAnimationToLeft}
            >
              <Profil />
            </IonModal>
          )}

          <IonItem
            className='labelMenu'
            button
            onClick={() => dispatch(showActions.setShowFeedback(true))}
            lines='none'
            detail={false}
          >
            <IonLabel>Feedback</IonLabel>
            <IonIcon slot='end' icon={pencil} />
          </IonItem>
          {showFeedback && (
            <IonModal
              cssClass={`${isPlatform('desktop') ? 'menuModalDesktop' : 'menuModal'}`}
              isOpen={showFeedback}
              swipeToClose={true}
              backdropDismiss={true}
              onDidDismiss={() => dispatch(showActions.setShowFeedback(false))}
              enterAnimation={enterAnimationFromLeft}
              leaveAnimation={leaveAnimationToLeft}
            >
              <Feedback />
            </IonModal>
          )}

          <IonItem
            className='labelMenu'
            button
            onClick={() => dispatch(showActions.setShowAbout(true))}
            lines='none'
            detail={false}
          >
            <IonLabel>About</IonLabel>
            <IonIcon slot='end' icon={informationCircle} />
          </IonItem>
          {showAbout && (
            <IonModal
              cssClass={`${isPlatform('desktop') ? 'menuModalDesktop' : 'menuModal'}`}
              isOpen={showAbout}
              swipeToClose={true}
              backdropDismiss={true}
              onDidDismiss={() => dispatch(showActions.setShowAbout(false))}
              enterAnimation={enterAnimationFromLeft}
              leaveAnimation={leaveAnimationToLeft}
            >
              <About />
            </IonModal>
          )}

          <IonItem
            className='labelMenu'
            button
            onClick={() => menuController.toggle()}
            routerLink='/datenschutz'
            lines={isAuth ? 'full' : 'none'}
            detail={false}
          >
            <IonLabel>Datenschutz</IonLabel>
            <IonIcon slot='end' icon={lockClosed} />
          </IonItem>

          {isAuth && (
            <IonItem
              button
              onClick={handleLogout}
              className='labelMenu mt-3 pe-2'
              routerLink='/logout'
              lines='none'
              detail={false}
            >
              <IonIcon slot='start' icon={logOut} />
              <IonLabel>Logout</IonLabel>
            </IonItem>
          )}
          {successMsg && (
            <div className='successMsg text-center ion-padding'>
              <div>{successMsg}</div>
              <div>
                Du wurdest ausgeloggt, da du deine E-Mail wechselst. Klicke auf den
                Bestätigungs-Link in deinem Postfach. Kontrolliere auch den Spam-Ordner.
              </div>
            </div>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Menu;

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
  IonListHeader,
  IonModal,
  IonPage,
  IonToolbar,
  isPlatform,
} from '@ionic/react';
import {
  exitOutline,
  informationCircleOutline,
  keyOutline,
  logInOutline,
  magnetOutline,
  paperPlaneOutline,
  personOutline,
} from 'ionicons/icons';
import SwitchTheme from './SwitchTheme';
import Feedback from './Feedback';
import About from './About';
import Profil from './Profil';

const Menu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.user);
  const { showProfil, showFeedback, showAbout } = useAppSelector((state) => state.show);
  const { successMessage: successMsg } = useAppSelector((state) => state.app);

  const { isDarkTheme } = useThemeContext();
  const { enterAnimationFromBottom, leaveAnimationToBottom } = useAnimation();

  const handleLogout = () => dispatch(userActions.logout());

  return (
    <IonPage>
      <IonToolbar color='primary'>
        <div className='text-center'>Einstellungen</div>
      </IonToolbar>
      <IonContent fullscreen className='item--item-background'>
        <IonItem className='item--item-background label--menu' lines='none'>
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
        {!isAuth && (
          <>
            <IonItem
              className='item--item-background label--menu'
              disabled={isAuth}
              routerLink='/login'
              lines='none'
              detail={false}
              button
              onClick={async () => await menuController.toggle()}
            >
              <IonLabel>Login</IonLabel>
              <IonIcon slot='end' icon={logInOutline} />
            </IonItem>
            <IonItem
              className='item--item-background label--menu'
              disabled={isAuth}
              routerLink='/register'
              lines='full'
              detail={false}
              button
              onClick={async () => await menuController.toggle()}
            >
              <IonLabel>Registrieren</IonLabel>
              <IonIcon slot='end' icon={magnetOutline} />
            </IonItem>
          </>
        )}

        {isAuth && (
          <IonItem
            className='item--item-background label--menu'
            button
            onClick={() => dispatch(showActions.setShowProfil(true))}
            lines='full'
            detail={false}
          >
            <IonLabel>Profil</IonLabel>
            <IonIcon slot='end' icon={personOutline} />
          </IonItem>
        )}

        <IonModal
          cssClass={`${isPlatform('desktop') ? 'menu-modal--desktop' : 'menu-modal'}`}
          isOpen={showProfil}
          swipeToClose={true}
          backdropDismiss={true}
          onDidDismiss={() => dispatch(showActions.setShowProfil(false))}
          enterAnimation={enterAnimationFromBottom}
          leaveAnimation={leaveAnimationToBottom}
        >
          <Profil />
        </IonModal>

        <IonItem
          className='item--item-background label--menu'
          button
          onClick={() => dispatch(showActions.setShowFeedback(true))}
          lines='none'
          detail={false}
        >
          <IonLabel>Feedback</IonLabel>
          <IonIcon slot='end' icon={paperPlaneOutline} />
        </IonItem>
        <IonModal
          cssClass={`${isPlatform('desktop') ? 'menu-modal--desktop' : 'menu-modal'}`}
          isOpen={showFeedback}
          swipeToClose={true}
          backdropDismiss={true}
          onDidDismiss={() => dispatch(showActions.setShowFeedback(false))}
          enterAnimation={enterAnimationFromBottom}
          leaveAnimation={leaveAnimationToBottom}
        >
          <Feedback />
        </IonModal>

        <IonItem
          className='item--item-background label--menu'
          button
          onClick={() => dispatch(showActions.setShowAbout(true))}
          lines='none'
          detail={false}
        >
          <IonLabel>About</IonLabel>
          <IonIcon slot='end' icon={informationCircleOutline} />
        </IonItem>

        <IonModal
          cssClass={`${isPlatform('desktop') ? 'menu-modal--desktop' : 'menu-modal'}`}
          isOpen={showAbout}
          swipeToClose={true}
          backdropDismiss={true}
          onDidDismiss={() => dispatch(showActions.setShowAbout(false))}
          enterAnimation={enterAnimationFromBottom}
          leaveAnimation={leaveAnimationToBottom}
        >
          <About />
        </IonModal>

        <IonItem
          className='item--item-background label--menu'
          button
          onClick={() => menuController.toggle()}
          routerLink='/datenschutz'
          lines={isAuth ? 'full' : 'none'}
          detail={false}
        >
          <IonLabel>Datenschutz</IonLabel>
          <IonIcon slot='end' icon={keyOutline} />
        </IonItem>

        {isAuth && (
          <IonItem
            button
            onClick={handleLogout}
            className='item--item-background label--menu'
            routerLink='/logout'
            lines='none'
            detail={false}
          >
            <IonIcon slot='start' icon={exitOutline} />
            <IonLabel>Logout</IonLabel>
          </IonItem>
        )}
        {successMsg && <div className='successMsg text-center ion-padding'>{successMsg}</div>}
      </IonContent>
    </IonPage>
  );
};

export default Menu;

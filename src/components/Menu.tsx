import { useReducer } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userActions } from '../store/userSlice';
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

enum ModalsActionTypes {
  OPEN_PROFIL = 'OPEN_PROFIL',
  CLOSE_PROFIL = 'CLOSE_PROFIL',
  OPEN_FEEDBACK = 'OPEN_FEEDBACK',
  CLOSE_FEEDBACK = 'CLOSE_FEEDBACK',
  OPEN_ABOUT = 'OPEN_ABOUT',
  CLOSE_ABOUT = 'CLOSE_ABOUT',
}

interface ModalsAction {
  type: ModalsActionTypes;
}

interface ModalState {
  profil: boolean;
  feedback: boolean;
  about: boolean;
}

const reducerFn = (prevState: ModalState, action: ModalsAction) => {
  switch (action.type) {
    case ModalsActionTypes.OPEN_PROFIL:
      return {
        ...prevState,
        profil: true,
      };
    case ModalsActionTypes.CLOSE_PROFIL:
      return {
        ...prevState,
        profil: false,
      };
    case ModalsActionTypes.OPEN_FEEDBACK:
      return {
        ...prevState,
        feedback: true,
      };
    case ModalsActionTypes.CLOSE_FEEDBACK:
      return {
        ...prevState,
        feedback: false,
      };
    case ModalsActionTypes.OPEN_ABOUT:
      return {
        ...prevState,
        about: true,
      };
    case ModalsActionTypes.CLOSE_ABOUT:
      return {
        ...prevState,
        about: false,
      };
    default:
      return prevState;
  }
};

const Menu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.user);

  const [showModal, dispatchModalAction] = useReducer(reducerFn, {
    profil: false,
    feedback: false,
    about: false,
  });

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
            onClick={() => dispatchModalAction({ type: ModalsActionTypes.OPEN_PROFIL })}
            lines='full'
            detail={false}
          >
            <IonLabel>Profil</IonLabel>
            <IonIcon slot='end' icon={personOutline} />
          </IonItem>
        )}

        <IonModal
          cssClass={`${isPlatform('desktop') ? 'menu-modal--desktop' : 'menu-modal'}`}
          isOpen={showModal.profil}
          swipeToClose={true}
          backdropDismiss={true}
          onDidDismiss={() => dispatchModalAction({ type: ModalsActionTypes.CLOSE_PROFIL })}
          enterAnimation={enterAnimationFromBottom}
          leaveAnimation={leaveAnimationToBottom}
        >
          <Profil
            onCloseProfil={() => dispatchModalAction({ type: ModalsActionTypes.CLOSE_PROFIL })}
          />
        </IonModal>

        <IonItem
          className='item--item-background label--menu'
          button
          onClick={() => dispatchModalAction({ type: ModalsActionTypes.OPEN_FEEDBACK })}
          lines='none'
          detail={false}
        >
          <IonLabel>Feedback</IonLabel>
          <IonIcon slot='end' icon={paperPlaneOutline} />
        </IonItem>
        <IonModal
          cssClass={`${isPlatform('desktop') ? 'menu-modal--desktop' : 'menu-modal'}`}
          isOpen={showModal.feedback}
          swipeToClose={true}
          backdropDismiss={true}
          onDidDismiss={() => dispatchModalAction({ type: ModalsActionTypes.CLOSE_FEEDBACK })}
          enterAnimation={enterAnimationFromBottom}
          leaveAnimation={leaveAnimationToBottom}
        >
          <Feedback
            onCloseFeedback={() => dispatchModalAction({ type: ModalsActionTypes.CLOSE_FEEDBACK })}
          />
        </IonModal>

        <IonItem
          className='item--item-background label--menu'
          button
          onClick={() => dispatchModalAction({ type: ModalsActionTypes.OPEN_ABOUT })}
          lines='none'
          detail={false}
        >
          <IonLabel>About</IonLabel>
          <IonIcon slot='end' icon={informationCircleOutline} />
        </IonItem>

        <IonModal
          cssClass={`${isPlatform('desktop') ? 'menu-modal--desktop' : 'menu-modal'}`}
          isOpen={showModal.about}
          swipeToClose={true}
          backdropDismiss={true}
          onDidDismiss={() => dispatchModalAction({ type: ModalsActionTypes.CLOSE_ABOUT })}
          enterAnimation={enterAnimationFromBottom}
          leaveAnimation={leaveAnimationToBottom}
        >
          <About
            onCloseAbout={() => dispatchModalAction({ type: ModalsActionTypes.CLOSE_ABOUT })}
          />
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
        {successMsg && <div className='text--success text-center ion-padding'>{successMsg}</div>}
      </IonContent>
    </IonPage>
  );
};

export default Menu;

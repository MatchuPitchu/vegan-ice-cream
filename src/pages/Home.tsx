import { useState, useEffect, useRef, VFC } from 'react';
import type { PopoverState } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
import { showActions } from '../store/showSlice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonPopover,
  isPlatform,
} from '@ionic/react';
import {
  create,
  extensionPuzzleSharp,
  gift,
  giftOutline,
  iceCreamOutline,
  logIn,
  logoApple,
  logoGooglePlaystore,
  logoPaypal,
  phonePortraitOutline,
} from 'ionicons/icons';
import SearchHome from '../components/SearchHome';

const Home: VFC = () => {
  const { isDarkTheme } = useThemeContext();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { topLocationsInCity } = useAppSelector((state) => state.locations);

  const [show, setShow] = useState(false);
  const [popoverShow, setPopoverShow] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    if (topLocationsInCity.length > 0) {
      const timerId = setTimeout(() => contentRef?.current?.scrollToBottom(500), 500);
      return () => clearTimeout(timerId);
    }
  }, [topLocationsInCity]);

  return (
    <IonPage>
      <IonHeader>
        <img
          className='headerMap'
          src={`${
            isDarkTheme ? './assets/header-home-dark.svg' : './assets/header-home-light.svg'
          }`}
          alt=''
        />
      </IonHeader>

      <div className={`${show && 'fabOpen'}`}></div>

      <IonContent
        className='home'
        ref={contentRef}
        scrollEvents
        style={{
          backgroundImage: `url(./assets/images/${
            isDarkTheme
              ? 'ice-cream-red-dark-pablo-merchan-montes-unsplash.jpg'
              : 'ice-cream-yellow-light-wesual-click-unsplash.jpg'
          })`,
        }}
      >
        <div className='run-text'>
          <h1>
            <div className='run-text__title'>veganes Eis</div>
            <div className='run-text__wrapper'>
              <div className='run-text__words' aria-hidden='true'>
                <strong className='run-text__word'>entdecken</strong>
                <strong className='run-text__word'>genießen</strong>
                <strong className='run-text__word'>eintragen</strong>
              </div>
              <div className='run-text__final'>entdecken</div>
              <div className='run-text__final'>genießen</div>
              <div className='run-text__final'>eintragen</div>
            </div>
          </h1>
          <div className={`${isDarkTheme ? 'overlay--dark' : 'overlay--light'}`}>
            <IonIcon className='start-ice-cream-icon' icon={iceCreamOutline} />
          </div>
          <IonButton
            className='start-btn-wrapper'
            routerLink={`${user ? '/entdecken' : ''}`}
            fill='clear'
            onClick={(event) => {
              if (user) {
                dispatch(locationsActions.resetNewLocation());
                dispatch(showActions.setShowSearchNewLocationModal(true));
              } else {
                event.persist();
                setPopoverShow({ showPopover: true, event });
              }
            }}
          >
            <div className='start-btn'>
              <span></span>
              <span className='start-btn__text'>
                <IonIcon icon={extensionPuzzleSharp} />
                <span>Eisladen</span>
              </span>
              <span className='start-btn__ring'></span>
            </div>
          </IonButton>
          <IonPopover
            cssClass='info-popover'
            event={popoverShow.event}
            isOpen={popoverShow.showPopover}
            onDidDismiss={() => setPopoverShow({ showPopover: false, event: undefined })}
          >
            <div className='my-2'>
              <div>Nur für eingeloggte User</div>
              <IonButton routerLink='/login' fill='solid' className='click-btn mt-2'>
                <IonLabel>Login</IonLabel>
                <IonIcon className='pe-1' icon={logIn} />
              </IonButton>
              <IonButton routerLink='/register' fill='solid' className='click-btn'>
                <IonLabel>Registrieren</IonLabel>
                <IonIcon className='pe-1' icon={create} />
              </IonButton>
            </div>
          </IonPopover>
        </div>

        <SearchHome />
      </IonContent>

      <IonFab className='me-2' vertical='bottom' horizontal='end' slot='fixed'>
        <IonFabButton
          size='small'
          onClick={() => setShow((prev) => !prev)}
          activated={show ? true : false}
        >
          <IonIcon className='fab-icon' icon={giftOutline} />
        </IonFabButton>
        <IonFabList color='dark' side='start'>
          <IonFabButton
            className='donate-btn'
            href='https://paypal.me/eismitstil'
            target='_blank'
            rel='noopener noreferrer'
            routerDirection='forward'
            color='primary'
            onClick={() => setShow((prev) => !prev)}
          >
            <div className='d-flex flex-column align-items-center mt-3'>
              <div className='mx-3 mb-2 ion-text-wrap'>
                <b>Gefällt dir die App?</b>
              </div>
              <div className='mx-3 mb-2 ion-text-wrap'>Teile die App mit Freund:innen.</div>
              <div className='mx-3 mb-2 ion-text-wrap'>
                Auch bin ich dankbar für jede Unterstützung, um die Betriebskosten decken und die
                App weiterentwickeln zu können.
              </div>
              <IonIcon className='mt-2 donateIcon' icon={logoPaypal} />
            </div>
          </IonFabButton>
        </IonFabList>
      </IonFab>

      {isPlatform('desktop') ||
        (isPlatform('mobileweb') && (
          <IonFab vertical='bottom' horizontal='start' slot='fixed'>
            <IonFabButton size='small' color='primary' className='logo-btn'>
              <IonIcon className='fab-icon' icon={phonePortraitOutline} />
            </IonFabButton>
            <IonFabList side='top'>
              <IonFabButton
                color='primary'
                className='logo-btn'
                routerDirection='forward'
                target='_blank'
                rel='noopener noreferrer'
                href='https://play.google.com/store/apps/details?id=eismitstil.app'
              >
                <IonIcon icon={logoGooglePlaystore} />
              </IonFabButton>
              <IonFabButton
                color='primary'
                className='logo-btn'
                routerDirection='forward'
                routerLink='/ios'
              >
                <IonIcon icon={logoApple} />
              </IonFabButton>
            </IonFabList>
          </IonFab>
        ))}
    </IonPage>
  );
};

export default Home;

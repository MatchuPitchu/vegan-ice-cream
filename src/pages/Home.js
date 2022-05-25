import { useContext, useState, useEffect, useRef } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
// Context
import { Context } from '../context/Context';
import { useThemeContext } from '../context/ThemeContext';
import {
  IonButton,
  IonCard,
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
  add,
  create,
  gift,
  iceCream,
  logIn,
  logoApple,
  logoGooglePlaystore,
  logoPaypal,
  phonePortraitOutline,
  star,
} from 'ionicons/icons';
import SearchTopLocations from '../components/SearchTopLocations';
import TopLocations from '../components/TopLocations';
import { locationsActions } from '../store/locationsSlice';

const Home = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const { cityName, topLocations, noTopLoc, setAutocompleteModal } = useContext(Context);
  const { isDarkTheme } = useThemeContext();

  const [show, setShow] = useState(false);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });
  const contentRef = useRef(null);

  useEffect(() => {
    // (number) means duration
    const id = setTimeout(() => contentRef.current && contentRef.current.scrollToBottom(500), 500);

    return () => clearTimeout(id);
  }, [topLocations]);

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
          <h1 className='title'>
            veganes Eis
            <br />
            <div className='run-text-wrapper'>
              <div className='run-text-words' aria-hidden='true'>
                <strong className='run-text-word'>entdecken</strong>
                <strong className='run-text-word'>genießen</strong>
                <strong className='run-text-word'>eintragen</strong>
              </div>
              <div className='run-text-final'>entdecken</div>
              <div className='run-text-final'>genießen</div>
              <div className='run-text-final'>eintragen</div>
            </div>
          </h1>
          <div className={`${isDarkTheme ? 'overlay' : 'overlay-light'}`}>
            <IonIcon className='startIceIcon' icon={iceCream} />
          </div>
          <IonButton
            className='start-btn-wrapper'
            routerLink={`${user ? '/entdecken' : ''}`}
            fill='clear'
            onClick={(e) => {
              if (user) {
                dispatch(locationsActions.resetNewLocation());
                setAutocompleteModal(true);
              } else {
                e.persist();
                setPopoverShow({ show: true, event: e });
              }
            }}
          >
            <div className='start-btn-container'>
              <div>
                <span className='btn-ring'></span>
                <span className='btn-border'></span>
                <span className='btn-text'>
                  <IonIcon icon={add} />
                  <br />
                  Eisladen
                  <br />
                  eintragen
                </span>
              </div>
            </div>
          </IonButton>
          <IonPopover
            color='primary'
            cssClass='info-popover'
            event={popoverShow.event}
            isOpen={popoverShow.show}
            onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
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

        <SearchTopLocations />

        {noTopLoc && (
          <div className='container text-center'>
            <IonCard>
              <div className='noTopLocCard'>
                Noch keine Top Eisläden mit 3+
                <IonIcon size='small' color='primary' icon={star} />
                <br />
                in <span className='highlightSpan'>{cityName}</span> gefunden.
                <br />
              </div>
            </IonCard>
          </div>
        )}

        {topLocations.length ? <TopLocations /> : null}
      </IonContent>

      <IonFab className='me-2' vertical='bottom' horizontal='end' slot='fixed'>
        <IonFabButton
          size='small'
          onClick={() => setShow((prev) => !prev)}
          activated={show ? true : false}
        >
          <IonIcon icon={gift} />
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

      {isPlatform('desktop') || isPlatform('mobileweb') ? (
        <IonFab vertical='bottom' horizontal='start' slot='fixed'>
          <IonFabButton size='small' color='primary' className='logo-btn'>
            <IonIcon icon={phonePortraitOutline} />
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
      ) : null}
    </IonPage>
  );
};

export default Home;

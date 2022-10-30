import { useState, useEffect, useRef, VFC } from 'react';
import type { PopoverState } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
import { showActions } from '../store/showSlice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import { IonButton, IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonPopover, isPlatform } from '@ionic/react';
import {
  extensionPuzzleSharp,
  giftOutline,
  iceCreamOutline,
  logoApple,
  logoGooglePlaystore,
  phonePortraitOutline,
} from 'ionicons/icons';
import { ListLocations } from '../components/ListLocations';
import PopoverContentNotRegistered from '../components/Popover/PopoverContentNotRegistered';
import PageWrapper from '../components/PageUtils/PageWrapper';
import SearchHome from '../components/Search/SearchHome';
import ListFilter from '../components/ListFilter';

const Home: VFC = () => {
  const { isDarkTheme } = useThemeContext();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { topLocationsInCity } = useAppSelector((state) => state.locations);

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
    <PageWrapper showIonHeader={false} showIonContent={false}>
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
        <div className='header-app'>
          <div className='header-app__information'>
            <h1>
              <div className='header-app__title'>veganes Eis</div>
              <div className='header-app__animated-text'>
                <div className='header-app__animated-words-mounting' aria-hidden='true'>
                  <strong className='header-app__animated-word-mounting'>entdecken</strong>
                  <strong className='header-app__animated-word-mounting'>genießen</strong>
                  <strong className='header-app__animated-word-mounting'>eintragen</strong>
                </div>
                <div className='header-app__animated-word-final'>entdecken</div>
                <div className='header-app__animated-word-final'>genießen</div>
                <div className='header-app__animated-word-final'>eintragen</div>
              </div>
            </h1>

            <IonButton
              className='header-app__button'
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
              <div className='header-app__button-content'>
                <span className='header-app__button-text'>
                  <IonIcon icon={extensionPuzzleSharp} />
                  <span>Eisladen</span>
                </span>
                <span className='header-app__button-animated-ring'></span>
              </div>
            </IonButton>
          </div>

          <div className='header-app__overlay'>
            <IonIcon className='header-app__ice-cream-icon' icon={iceCreamOutline} />
          </div>

          <div className='container-content container-content--search-home'>
            <SearchHome />
            <ListFilter />
          </div>
        </div>

        <ListLocations />
      </IonContent>

      <IonPopover
        cssClass='info-popover'
        event={popoverShow.event}
        isOpen={popoverShow.showPopover}
        onDidDismiss={() => setPopoverShow({ showPopover: false, event: undefined })}
      >
        <PopoverContentNotRegistered />
      </IonPopover>

      <IonFab vertical='bottom' horizontal='end' slot='fixed'>
        <IonFabButton size='small' color='primary' className='logo-btn' translucent={true}>
          <IonIcon className='fab-icon' icon={phonePortraitOutline} />
        </IonFabButton>
        <IonFabList side='start'>
          {isPlatform('desktop') ||
            (isPlatform('mobileweb') && (
              <>
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
                <IonFabButton color='primary' className='logo-btn' routerDirection='forward' routerLink='/ios'>
                  <IonIcon icon={logoApple} />
                </IonFabButton>
              </>
            ))}

          <IonFabButton color='primary' className='logo-btn' routerDirection='forward' routerLink='/beitragen'>
            <IonIcon icon={giftOutline} />
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </PageWrapper>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import type { PopoverState } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useUpdateNumberOfNewLocationsMutation } from '../store/api/user-api-slice';
import { userActions } from '../store/userSlice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import { menuController } from '@ionic/core';
import { IonButtons, IonIcon, IonMenu, IonPage, IonPopover } from '@ionic/react';
import { analytics, cog, pin } from 'ionicons/icons';
import Menu from './Menu';
import SwitchTheme from './SwitchTheme';

const HeaderApp = () => {
  const dispatch = useAppDispatch();
  const { user, numberOfNewLocations } = useAppSelector((state) => state.user);
  const numberOfLocations = useAppSelector((state) => state.locations.locations.length);

  const { isDarkTheme } = useThemeContext();

  const [showPopover, setShowPopover] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });
  const [showPopoverNumberOfLocations, setShowPopoverNumberOfLocations] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });

  const [triggerUpdateNumberOfNewLocations] = useUpdateNumberOfNewLocationsMutation();

  useEffect(() => {
    if (numberOfLocations && user) {
      dispatch(userActions.setNumberOfNewLocations(numberOfLocations - user.num_loc_last_visit!));
      const timer = setTimeout(
        async () =>
          await triggerUpdateNumberOfNewLocations({
            user_id: user._id,
            numberOfLocations,
          }),
        25000
      );
      return () => clearTimeout(timer);
    }
  }, [numberOfLocations, user, triggerUpdateNumberOfNewLocations, dispatch]);

  return (
    <>
      <div className='toolbar'>
        <SwitchTheme />

        <img
          className='toolbar__image'
          src={`${isDarkTheme ? './assets/header-app-dark.svg' : './assets/header-app-light.svg'}`}
          alt=''
        />

        <IonButtons>
          {!!numberOfLocations && (
            <div
              className='info-number-locations'
              onClick={(event) => {
                event.persist();
                setShowPopoverNumberOfLocations({ showPopover: true, event });
              }}
            >
              <IonIcon
                color={`${isDarkTheme ? 'primary' : 'dark'}`}
                className='info-number-locations__icon--rotated'
                icon={pin}
                title='Neue Eisläden seit letztem Besuch'
              />
              <div className='info-number-locations__number'>{numberOfLocations}</div>
              <IonPopover
                cssClass='info-popover'
                event={showPopoverNumberOfLocations.event}
                isOpen={showPopoverNumberOfLocations.showPopover}
                onDidDismiss={() =>
                  setShowPopoverNumberOfLocations({ showPopover: false, event: undefined })
                }
              >
                <div className='info-popover__content'>Eingetragene Eisläden in der App</div>
              </IonPopover>
            </div>
          )}
          {user && (
            <div
              className='info-number-locations'
              onClick={(event) => {
                event.persist();
                setShowPopover({ showPopover: true, event });
              }}
            >
              <IonIcon
                color={`${isDarkTheme ? 'primary' : 'dark'}`}
                icon={analytics}
                title='Neue Eisläden seit letztem Besuch'
              />
              <div className='info-number-locations__number'>{numberOfNewLocations || 0}</div>
              <IonPopover
                cssClass='info-popover'
                event={showPopover.event}
                isOpen={showPopover.showPopover}
                onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
              >
                <div className='info-popover__content'>Neue Eisläden seit letztem Besuch</div>
              </IonPopover>
            </div>
          )}

          <IonIcon
            className='icon--button icon--rotate'
            color={`${isDarkTheme ? 'primary' : 'dark'}`}
            onClick={async () => await menuController.toggle()}
            icon={cog}
          />
        </IonButtons>
      </div>

      <IonMenu contentId='settings' type='overlay' swipeGesture={true}>
        <Menu />
      </IonMenu>
      <IonPage id='settings'></IonPage>
    </>
  );
};

export default HeaderApp;

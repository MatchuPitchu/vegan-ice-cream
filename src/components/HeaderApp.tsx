import { useEffect, useState } from 'react';
import type { PopoverState } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useUpdateNumberOfNewLocationsMutation } from '../store/api/user-api-slice';
import { userActions } from '../store/userSlice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import { menuController } from '@ionic/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonIcon,
  IonMenu,
  IonPage,
  IonPopover,
  IonToolbar,
} from '@ionic/react';
import { cog, storefront } from 'ionicons/icons';
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
      <IonToolbar className='headerToolbar'>
        <IonButtons slot='start'>
          <SwitchTheme />
        </IonButtons>

        <IonButtons slot='end'>
          {user && (
            <>
              <IonIcon
                color={`${isDarkTheme ? 'primary' : 'dark'}`}
                onClick={(event) => {
                  event.persist();
                  setShowPopover({ showPopover: true, event });
                }}
                icon={storefront}
                title='Neue Eisläden seit letztem Besuch'
              />
              <IonBadge slot='end' color='secondary'>
                {numberOfNewLocations || 0}
              </IonBadge>

              <IonPopover
                cssClass='info-popover'
                event={showPopover.event}
                isOpen={showPopover.showPopover}
                onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
              >
                Neue Eisläden seit letztem Besuch
              </IonPopover>
            </>
          )}
          <IonButton
            color={`${isDarkTheme ? 'primary' : 'dark'}`}
            className='rotateIcon ms-3'
            fill='clear'
            onClick={async () => await menuController.toggle()}
          >
            <IonIcon icon={cog} />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      <IonMenu contentId='settings' type='overlay' swipeGesture={true}>
        <Menu />
      </IonMenu>
      <IonPage id='settings'></IonPage>
    </>
  );
};

export default HeaderApp;

import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { menuController } from '@ionic/core';
import { IonBadge, IonButton, IonButtons, IonIcon, IonLabel, IonMenu, IonPage, IonPopover, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react';
import { cog, listCircle, storefront, map as mapIcon } from 'ionicons/icons';
import Menu from './Menu';
import Toggle from './Toggle';

const HeaderApp = () => {
  const {
    toggle,
    user,
    numNewLoc,
  } = useContext(Context);

  const [ popoverShow, setPopoverShow ] = useState({ show: false, event: undefined });

  return (
    <>
      <IonToolbar>
        <IonButtons slot="start" >
          <Toggle />
        </IonButtons>
   
        <IonButtons slot="end" >
          {user && (
            <>
              <IonIcon
                color={`${toggle ? "primary" : ''}`}
                button 
                onClick={e => {
                  e.persist();
                  setPopoverShow({ show: true, event: e })
                }}
                icon={storefront}
                title="Neue Eisläden seit letztem Besuch"
              />
              <IonBadge slot="end" color="secondary">{numNewLoc ? numNewLoc : 0}</IonBadge>
          
              <IonPopover
                color="primary"
                cssClass='info-popover'
                event={popoverShow.event}
                isOpen={popoverShow.show}
                onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
              >
                Neue Eisläden seit letztem Besuch
              </IonPopover>
            </>
          )}
          <IonButton className="rotateIcon ms-3" fill="clear" onClick={ async () => await menuController.toggle()}>
            <IonIcon icon={cog} />
          </IonButton>
        </IonButtons>
      </IonToolbar>   

      <IonMenu contentId="settings" type="overlay" swipeGesture={true}>
        <Menu />
      </IonMenu>
      <IonPage id="settings"></IonPage>
    </>
  )
}

export default HeaderApp;

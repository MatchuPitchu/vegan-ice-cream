import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { menuController } from '@ionic/core';
import { IonBadge, IonButton, IonButtons, IonIcon, IonLabel, IonMenu, IonPage, IonPopover, IonToolbar } from '@ionic/react';
import { alarmOutline, menu } from 'ionicons/icons';
import Menu from './Menu';
import Toggle from './Toggle';

const HeaderApp = () => {
  const {
    user,
    numNewLoc
  } = useContext(Context);

  const [ popoverShow, setPopoverShow ] = useState({ show: false, event: undefined });

  return (
    <>
      <IonToolbar className="headerImg">
        <div className="ms-1">
          <Toggle />
        </div>
        <IonButtons slot="primary" >
          {user && (
            <>
              <IonIcon
                button 
                onClick={e => {
                  e.persist();
                  setPopoverShow({ show: true, event: e })
                }}
                icon={alarmOutline}
              />
              <IonBadge slot="end" color="secondary">{numNewLoc ? numNewLoc : null}</IonBadge>
          
              <IonPopover
                color="primary"
                cssClass='my-custom-class'
                event={popoverShow.event}
                isOpen={popoverShow.show}
                onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
              >
                <p>Neue Eisläden seit deinem letzten Besuch:</p>
                <p>{numNewLoc}</p>
              </IonPopover>
            </>
          )}
          <IonButton className="ms-3" fill="clear" onClick={ async () => await menuController.toggle()}>
            <IonIcon icon={menu} />
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

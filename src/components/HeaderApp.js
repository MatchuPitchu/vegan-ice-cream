import { useContext } from 'react';
import { Context } from '../context/Context';
import { menuController } from '@ionic/core';
import { IonButton, IonButtons, IonIcon, IonMenu, IonPage, IonToolbar } from '@ionic/react';
import { alarmOutline, menu } from 'ionicons/icons';
import Menu from './Menu';
import Toggle from './Toggle';

const HeaderApp = () => {
  const { searchText, setSearchText } = useContext(Context);

  return (
    <>
      <IonToolbar className="headerImg">
        <div className="ms-1">
          <Toggle />
        </div>
        <IonButtons slot="primary" >
          <IonButton fill="clear" >
            <IonIcon icon={alarmOutline} />
          </IonButton>
          <IonButton fill="clear" onClick={ async () => await menuController.toggle()}>
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

import { VFC } from 'react';
import { IonItem, IonCard, IonLabel } from '@ionic/react';

const LogoutContent: VFC = () => {
  return (
    <div className='container-content--center'>
      <IonCard>
        <IonItem lines='full' className='item--item-background'>
          <IonLabel className='text-center ion-text-wrap'>Logout erfolgreich</IonLabel>
        </IonItem>
        <p className='text-center text--small-light px-2 my-2 '>
          Melde dich wieder an, wenn du neue Eisläden eintragen, bewerten und zu deinen Favoriten
          hinzufügen möchtest.
        </p>
      </IonCard>
    </div>
  );
};

export default LogoutContent;

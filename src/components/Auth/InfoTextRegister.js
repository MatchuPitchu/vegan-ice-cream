import { IonButton, IonCard, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { lockClosed } from 'ionicons/icons';

const InfoTextRegister = () => (
  <>
    <IonCard>
      <IonItem lines='full'>
        <IonLabel className='text-center ion-text-wrap' color='primary'>
          Hinweise zur Wahl des Passworts
        </IonLabel>
      </IonItem>
      <div className='text-center px-2 my-2'>
        <div className='item-text--small'>mindestens eine Ziffer [0-9]</div>
        <div className='item-text--small'>mindestens einen kleinen Buchstaben [a-z]</div>
        <div className='item-text--small'>mindestens einen großen Buchstaben [A-Z]</div>
        <div className='item-text--small'>mindestens 6 Stellen lang, maximal 32</div>
        <div className='item-text--smallWarning mt-3 ion-text-wrap'>
          Dein Passwort wird verschlüsselt in der Datenbank gespeichert und ist für niemanden
          einzusehen
        </div>
      </div>
    </IonCard>
    <IonCard>
      <p className='text-center item-text--small ion-text-wrap px-2 my-2 '>
        Hier findest du die Datenschutzhinweise, denen du mit der Registrierung zustimmst
      </p>
      <p className='text-center'>
        <IonButton className='add-control' button routerLink='/datenschutz' lines='none'>
          <IonLabel>Datenschutz</IonLabel>
          <IonIcon slot='end' icon={lockClosed} />
        </IonButton>
      </p>
    </IonCard>
  </>
);

export default InfoTextRegister;

import { VFC } from 'react';
import { IonButton, IonIcon, IonLabel } from '@ionic/react';
import { logInOutline, magnetOutline } from 'ionicons/icons';

const PopoverContentNotRegistered: VFC = () => {
  return (
    <>
      <div className='info-popover__header'>Nur mit Anmeldung</div>
      <div className='info-popover__content'>
        <IonButton
          routerLink='/login'
          fill='clear'
          className='button--check button--check-large'
          expand='block'
        >
          <IonLabel>Login</IonLabel>
          <IonIcon slot='end' icon={logInOutline} />
        </IonButton>
        <IonButton
          routerLink='/register'
          fill='clear'
          className='button--check button--check-large'
          expand='block'
        >
          <IonLabel>Registrieren</IonLabel>
          <IonIcon slot='end' icon={magnetOutline} />
        </IonButton>
      </div>
    </>
  );
};

export default PopoverContentNotRegistered;

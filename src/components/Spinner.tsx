import { VFC } from 'react';
// Redux Store
import { useAppSelector } from '../store/hooks';
// import spinner
import { css } from '@emotion/core';
import { RingLoader } from 'react-spinners';
import { IonButton, IonContent, IonIcon, IonLabel } from '@ionic/react';
import { logInOutline, magnetOutline } from 'ionicons/icons';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: flex;
  margin: 20px auto;
  background-color: transparent;
  opacity: 0.8;
`;

const Spinner: VFC = () => {
  const { isAuth } = useAppSelector((state) => state.user);

  const { activateAccountMessage } = useAppSelector((state) => state.app);

  if (activateAccountMessage === 'Aktivierung des Mail-Accounts erfolgreich')
    return (
      <IonContent>
        <div className='container-content--center'>
          <RingLoader color='var(--ion-color-primary)' css={override} size={50} />
          <h3 style={{ fontSize: '1rem' }} className='display-3'>
            {activateAccountMessage}
          </h3>
          <IonButton
            routerLink='/login'
            className='button--check button--check-large my-3 mx-5'
            fill='clear'
            expand='block'
          >
            <IonLabel>Login</IonLabel>
            <IonIcon slot='end' icon={logInOutline} />
          </IonButton>
        </div>
      </IonContent>
    );

  return (
    <IonContent>
      <div className='container-content--center'>
        <RingLoader color='var(--ion-color-primary)' css={override} size={50} />
        <h3 style={{ fontSize: '1.2em' }} className='display-3'>
          {isAuth ? 'lädt ...' : 'Nur für eingeloggte User sichtbar'}
        </h3>
        {!isAuth && (
          <>
            <IonButton
              routerLink='/login'
              fill='clear'
              className='button--check button--check-large my-3 mx-5'
              expand='block'
            >
              <IonLabel>Login</IonLabel>
              <IonIcon slot='end' icon={logInOutline} />
            </IonButton>

            <IonButton
              routerLink='/register'
              fill='clear'
              className='button--check button--check-large my-3 mx-5'
              expand='block'
            >
              <IonLabel>Registrieren</IonLabel>
              <IonIcon slot='end' icon={magnetOutline} />
            </IonButton>

            <p className='text-center text--small-light ion-text-wrap px-2 my-2'>
              Nach dem Einloggen kannst du neue Eisläden eintragen, bewerten und zu deinen Favoriten
              hinzufügen.
            </p>
          </>
        )}
      </div>
    </IonContent>
  );
};

export default Spinner;

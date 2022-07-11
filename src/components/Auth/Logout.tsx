import { VFC } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { IonContent, IonPage, IonHeader, IonItem, IonCard, IonLabel } from '@ionic/react';

const Login: VFC = () => {
  const { isDarkTheme } = useThemeContext();

  return (
    <IonPage>
      <IonHeader>
        <img
          className='header-image--map'
          src={`${
            isDarkTheme ? './assets/header-home-dark.svg' : './assets/header-home-light.svg'
          }`}
          alt='Header App'
        />
      </IonHeader>
      <IonContent>
        <div className='container-content--center'>
          <IonCard>
            <IonItem lines='full' className='item--item-background'>
              <IonLabel className='text-center ion-text-wrap'>Logout erfolgreich</IonLabel>
            </IonItem>
            <p className='text-center text--small-light px-2 my-2 '>
              Melde dich wieder an, wenn du neue Eisläden eintragen, bewerten und zu deinen
              Favoriten hinzufügen möchtest.
            </p>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

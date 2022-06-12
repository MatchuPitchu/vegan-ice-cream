import { useThemeContext } from '../../context/ThemeContext';
import { IonContent, IonPage, IonHeader, IonItem, IonCard, IonLabel } from '@ionic/react';

const Login = () => {
  const { isDarkTheme } = useThemeContext();

  return (
    <IonPage>
      <IonHeader>
        <img
          className='headerMap'
          src={`${
            isDarkTheme ? './assets/header-home-dark.svg' : './assets/header-home-light.svg'
          }`}
          alt='Header App'
        />
      </IonHeader>
      <IonContent>
        <div className='container text-center'>
          <IonCard>
            <IonItem lines='full'>
              <IonLabel className='text-center ion-text-wrap' color='primary'>
                Logout erfolgreich
              </IonLabel>
            </IonItem>
            <p className='text-center item-text--small ion-text-wrap px-2 my-2 '>
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

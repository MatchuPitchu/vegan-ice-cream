import { VFC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
// Redux Store
import { useAppSelector } from '../../store/hooks';
import { useLoginUserMutation } from '../../store/api/auth-api-slice';
// Context
import { useThemeContext } from '../../context/ThemeContext';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonPage,
  IonHeader,
  IonIcon,
} from '@ionic/react';
import { Redirect } from 'react-router-dom';
import { keyOutline, logInOutline } from 'ionicons/icons';
import { CustomInput } from '../FormFields/CustomInput';

interface LoginValues {
  email: string;
  password: string;
}

const defaultLoginValues: LoginValues = {
  email: '',
  password: '',
};

const Login: VFC = () => {
  const { isAuth } = useAppSelector((state) => state.user);

  const { isDarkTheme } = useThemeContext();

  const { control, handleSubmit } = useForm({ defaultValues: defaultLoginValues });

  // https://redux-toolkit.js.org/rtk-query/usage/mutations
  const [triggerLogin, { error: fetchError }] = useLoginUserMutation();

  const onSubmit: SubmitHandler<LoginValues> = async (loginData) => await triggerLogin(loginData);

  if (isAuth) return <Redirect exact to='/home' />;

  return (
    <IonPage>
      <IonHeader>
        <img
          className='headerMap'
          src={`${
            isDarkTheme ? './assets/header-login-dark.svg' : './assets/header-login-light.svg'
          }`}
          alt='Header Login'
        />
      </IonHeader>
      <IonContent>
        <div className='container-content mt-3'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines='none' className='mb-1'>
              <CustomInput
                control={control}
                name='email'
                label='E-Mail'
                inputmode='email'
                rules={{ required: 'Deine Mail-Adresse fehlt.' }}
                isFocusedOnMount={true}
              />
            </IonItem>
            <IonItem lines='none' className='mb-1'>
              <CustomInput
                control={control}
                name='password'
                label='Passwort'
                type='password'
                rules={{ required: 'Trage ein gültiges Passwort ein.' }}
              />
            </IonItem>
            {fetchError && (
              <div className='message--alert'>
                Prüfe, ob du das richtige Passwort eingetippt hast oder ob du deine Mailadresse
                bestätigt hast.
              </div>
            )}

            <IonButton
              fill='clear'
              className='button--check button--check-large my-3 mx-5'
              expand='block'
              type='submit'
            >
              <IonIcon className='pe-1' icon={logInOutline} />
              Login
            </IonButton>
            <IonButton
              fill='clear'
              className='button--check button--check-light button--check-large my-3 mx-5'
              routerLink='/auth/reset-password'
              expand='block'
            >
              Passwort vergessen?
            </IonButton>
          </form>
          <p className='text-center item-text--small ion-text-wrap px-2 my-2'>
            Nach dem Einloggen kannst du neue Eisläden eintragen, bewerten und zu deinen Favoriten
            hinzufügen. Über den unteren Button findest du die Datenschutzhinweise, denen du mit dem
            Login zustimmst
          </p>

          <IonButton
            fill='clear'
            className='button--check button--check-light button--check-large my-3 mx-5'
            routerLink='/datenschutz'
            expand='block'
          >
            <IonIcon className='pe-1' icon={keyOutline} />
            <IonLabel>Datenschutz</IonLabel>
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

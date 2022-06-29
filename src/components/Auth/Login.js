import { Controller, useForm } from 'react-hook-form';
// Redux Store
import { useAppSelector } from '../../store/hooks';
import { useLoginUserMutation } from '../../store/api/auth-api-slice';
// Context
import { useThemeContext } from '../../context/ThemeContext';
import {
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonPage,
  IonHeader,
  IonIcon,
} from '@ionic/react';
import { Redirect } from 'react-router-dom';
import Error from '../Error';
import { keyOutline, logInOutline } from 'ionicons/icons';

const Login = () => {
  const { isAuth } = useAppSelector((state) => state.user);

  const { isDarkTheme } = useThemeContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // https://redux-toolkit.js.org/rtk-query/usage/mutations
  const [triggerLogin, { error: fetchError }] = useLoginUserMutation();

  const onSubmit = async (loginData) => await triggerLogin(loginData);

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
              <IonLabel position='floating' htmlFor='email'>
                E-Mail
              </IonLabel>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    type='email'
                    inputmode='email'
                    value={value}
                    onIonChange={(e) => onChange(e.detail.value)}
                  />
                )}
                name='email'
                rules={{ required: true }}
              />
            </IonItem>
            {Error('email', errors)}

            <IonItem lines='none' className='mb-1'>
              <IonLabel position='floating' htmlFor='password'>
                Passwort
              </IonLabel>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    type='password'
                    inputmode='text'
                    value={value}
                    onIonChange={(e) => onChange(e.detail.value)}
                  />
                )}
                name='password'
                rules={{ required: true }}
              />
            </IonItem>
            {Error('password', errors)}
            {fetchError && (
              <div className='alertMsg'>
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
              <IonIcon />
              Passwort vergessen?
            </IonButton>
          </form>
          <p className='text-center item-text--small ion-text-wrap'>
            Nach dem Einloggen kannst du neue Eisläden eintragen, bewerten und zu deinen Favoriten
            hinzufügen.
          </p>
          <p className='text-center item-text--small ion-text-wrap px-2 my-2 '>
            Hier findest du die Datenschutzhinweise, denen du mit dem Login zustimmst
          </p>
          <p className='text-center'>
            <IonButton
              fill='clear'
              className='button--check button--check-large my-3 mx-5'
              routerLink='/datenschutz'
              lines='none'
              expand='block'
            >
              <IonIcon slot='end' icon={keyOutline} />
              <IonLabel>Datenschutz</IonLabel>
            </IonButton>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

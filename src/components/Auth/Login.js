import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions } from '../../store/appSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useLoginUserMutation } from '../../store/api/auth-api-slice';
import { useGetAdditionalInfosFromUserQuery } from '../../store/api/user-api-slice';
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
import { lockClosed, logIn, refreshCircle } from 'ionicons/icons';

const Login = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.user);
  const { error } = useAppSelector((state) => state.app);

  const { isDarkTheme } = useThemeContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // https://redux-toolkit.js.org/rtk-query/usage/mutations
  const [triggerLogin] = useLoginUserMutation();
  const {
    data: additionUserData,
    error: errorRTKQuery,
    isFetching,
    isLoading,
    isSuccess,
    isError,
  } = useGetAdditionalInfosFromUserQuery(user?._id ?? skipToken);

  useEffect(() => {
    let timeoutId;
    if (isError) {
      dispatch(
        appActions.setError(
          'Prüfe, ob du das richtige Passwort eingetippt hast oder ob du deine Mailadresse bestätigt hast.'
        )
      );
      timeoutId = setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isError, dispatch]);

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
            {error && <div className='alertMsg'>{error}</div>}

            <IonButton className='my-3 confirm-btn' type='submit' fill='solid' expand='block'>
              <IonIcon className='pe-1' icon={logIn} />
              Login
            </IonButton>
            <IonButton routerLink='/auth/reset-password' size='small' fill='clear' expand='block'>
              <IonIcon slot='end' icon={refreshCircle} />
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
            <IonButton className='add-control' button routerLink='/datenschutz' lines='none'>
              <IonLabel>Datenschutz</IonLabel>
              <IonIcon slot='end' icon={lockClosed} />
            </IonButton>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

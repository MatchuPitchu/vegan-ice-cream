import { Controller, useForm } from 'react-hook-form';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { userActions } from '../../store/userSlice';
import { appActions } from '../../store/appSlice';
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
import showError from '../showError';
import { lockClosed, logIn, refreshCircle } from 'ionicons/icons';

const Login = () => {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.user);
  const { error } = useAppSelector((state) => state.app);

  const { isDarkTheme } = useThemeContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // converts JS data into JSON string.
        body: JSON.stringify(data),
        credentials: 'include',
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, options);
      const { user, token } = await res.json();
      if (user.confirmed) {
        const options = {
          headers: { token },
          credentials: 'include',
        };
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${user._id}/infos`,
          options
        );
        const data = await res.json();
        localStorage.setItem('token', token);
        dispatch(userActions.updateUser(data));
        // setUser({ ...user, ...data });
        dispatch(userActions.login());
      }
    } catch (error) {
      dispatch(
        appActions.setError(
          'Prüfe, ob du das richtige Passwort eingetippt hast oder ob du deine Mailadresse bestätigt hast.'
        )
      );
      setTimeout(() => dispatch(appActions.resetError()), 5000);
      console.log(error.message);
    }
  };

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
        <div className='container mt-3'>
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
            {showError('email', errors)}

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
            {showError('password', errors)}
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
          <p className='text-center itemTextSmall ion-text-wrap'>
            Nach dem Einloggen kannst du neue Eisläden eintragen, bewerten und zu deinen Favoriten
            hinzufügen.
          </p>
          <p className='text-center itemTextSmall ion-text-wrap px-2 my-2 '>
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

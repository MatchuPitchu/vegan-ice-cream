import { useState } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions } from '../../store/appSlice';
// Context
import { useThemeContext } from '../../context/ThemeContext';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import {
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonPage,
  IonHeader,
  IonIcon,
  IonCard,
} from '@ionic/react';
import Error from '../Error';
import { logIn } from 'ionicons/icons';
import LoadingError from '../LoadingError';
import InfoTextRegister from './InfoTextRegister';

const SetNewPassword = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.app);

  const { isDarkTheme } = useThemeContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const [endReset, setEndReset] = useState(false);

  const onSubmit = async ({ email, password, repeatedPassword }) => {
    dispatch(appActions.setIsLoading(true));
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken: id,
          email,
          password,
          repeatedPassword,
        }),
        credentials: 'include',
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/new-password`, options);
      const { message } = await res.json();
      if (message) setEndReset(true);
    } catch (error) {
      dispatch(appActions.setError(error.message));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    dispatch(appActions.setIsLoading(false));
  };

  return (
    <IonPage>
      <IonHeader>
        <img
          className='headerMap'
          src={`${
            isDarkTheme ? './assets/header-login-dark.svg' : './assets/header-login-light.svg'
          }`}
          alt='Header App'
        />
      </IonHeader>
      <IonContent>
        {!endReset ? (
          <div className='container-content mt-5'>
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
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <IonInput
                      type='password'
                      inputmode='text'
                      value={value}
                      onIonChange={(e) => onChange(e.detail.value)}
                    />
                  )}
                  name='password'
                  rules={{
                    required: true,
                    pattern: {
                      value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                      message:
                        'Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen',
                    },
                  }}
                />
              </IonItem>
              {Error('password', errors)}

              <IonItem lines='none' className='mb-1'>
                <IonLabel position='floating' htmlFor='repeatedPassword'>
                  Passwort wiederholen
                </IonLabel>
                <Controller
                  control={control}
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <IonInput
                      type='password'
                      id='repeatedPassword'
                      inputmode='text'
                      value={value}
                      onIonChange={(e) => onChange(e.detail.value)}
                    />
                  )}
                  name='repeatedPassword'
                  rules={{
                    required: true,
                    pattern: {
                      value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                      message:
                        'Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen',
                    },
                  }}
                />
              </IonItem>
              {Error('repeatedPassword', errors)}
              {error && <div className='alertMsg'>{error}</div>}

              <IonButton
                fill='clear'
                className='button--check button--check-large my-3 mx-5'
                expand='block'
                type='submit'
              >
                <IonIcon className='pe-1' icon={logIn} />
                Passwort erneuern
              </IonButton>
            </form>

            <InfoTextRegister />
          </div>
        ) : (
          <div className='container-content--center'>
            <IonCard>
              <IonItem lines='full'>
                <IonLabel className='text-center ion-text-wrap' color='primary'>
                  Passwort erfolgreich erneuert
                </IonLabel>
              </IonItem>
              <IonButton
                fill='clear'
                className='button--check button--check-large my-3 mx-5'
                expand='block'
                routerLink='/login'
              >
                <IonIcon className='pe-1' icon={logIn} />
                Login
              </IonButton>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SetNewPassword;

import { useState } from 'react';
// Redux Store
import { useAppDispatch } from '../../store/hooks';
import { appActions } from '../../store/appSlice';
import { Controller, useForm } from 'react-hook-form';
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
  IonCard,
} from '@ionic/react';
import Error from '../Error';
import { refreshCircle } from 'ionicons/icons';

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useThemeContext();

  const [success, setSuccess] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // converts JS data into JSON string.
        body: JSON.stringify(data),
        credentials: 'include',
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password`, options);
      const { message } = await res.json();
      if (!message) {
        dispatch(appActions.setError('Prüfe, ob du deine richtige Mailadresse eingetippt hast.'));
        setTimeout(() => dispatch(appActions.resetError()), 5000);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          {!success ? (
            <IonCard className='text-center'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonItem lines='none'>
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

                <IonButton className='my-3 mx-3 confirm-btn' type='submit'>
                  <IonIcon slot='end' className='pe-1' icon={refreshCircle} />
                  Passwort zurücksetzen
                </IonButton>
              </form>
            </IonCard>
          ) : (
            <IonCard className='text-center successMsg'>
              <div className='my-3 mx-3'>
                Schau in dein Mailpostfach. Du hast einen Link zum Zurücksetzen deines Passworts
                erhalten. Kontrolliere auch deinen Spam-Ordner.
              </div>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;

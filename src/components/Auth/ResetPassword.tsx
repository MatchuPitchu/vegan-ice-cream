import { useState } from 'react';
// Redux Store
import { useAppDispatch } from '../../store/hooks';
import { appActions } from '../../store/appSlice';
import { useResetPasswordMutation } from '../../store/api/auth-api-slice';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useThemeContext } from '../../context/ThemeContext';
import { IonContent, IonItem, IonButton, IonPage, IonHeader, IonIcon, IonCard } from '@ionic/react';
import { arrowBackCircleOutline, refreshCircleOutline } from 'ionicons/icons';
import { CustomInput } from '../FormFields/CustomInput';

interface ResetForm {
  email: string;
}

const defaultResetValues: ResetForm = {
  email: '',
};

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useThemeContext();

  const [success, setSuccess] = useState(false);
  const { control, handleSubmit } = useForm({ defaultValues: defaultResetValues });

  const [triggerResetPassword, result] = useResetPasswordMutation();

  const onSubmit: SubmitHandler<ResetForm> = async (data) => {
    const requestAnswer = await triggerResetPassword(data);
    if (requestAnswer.hasOwnProperty('data')) {
      setSuccess(true);
    } else {
      dispatch(appActions.setError('Prüfe, ob du deine richtige Mailadresse eingetippt hast.'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <img
          className='header-image--map'
          src={`${
            isDarkTheme ? './assets/header-login-dark.svg' : './assets/header-login-light.svg'
          }`}
          alt='Header Login'
        />
      </IonHeader>
      <IonContent>
        <div className='container-content mt-3'>
          {!success && (
            <IonCard className='text-center'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonItem lines='none'>
                  <CustomInput
                    control={control}
                    name='email'
                    label='E-Mail'
                    inputmode='email'
                    rules={{ required: 'Deine Mail-Adresse fehlt.' }}
                    isFocusedOnMount={true}
                  />
                </IonItem>

                <IonButton
                  fill='clear'
                  className='button--check button--check-large my-3 mx-5'
                  expand='block'
                  type='submit'
                >
                  <IonIcon className='pe-1' icon={refreshCircleOutline} />
                  Passwort zurücksetzen
                </IonButton>

                <IonButton
                  fill='clear'
                  className='button--check button--check-light button--check-large my-3 mx-5'
                  routerLink='/login'
                  expand='block'
                >
                  <IonIcon className='pe-1' icon={arrowBackCircleOutline} />
                  zurück zum Login
                </IonButton>
              </form>
            </IonCard>
          )}

          {success && (
            <IonCard className='text-center text--success'>
              <p className='my-3 mx-3'>
                Schau in dein Mailpostfach. Du hast einen Link zum Zurücksetzen deines Passworts
                erhalten. Kontrolliere auch deinen Spam-Ordner.
              </p>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;

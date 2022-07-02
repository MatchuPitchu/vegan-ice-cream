import { useState, VFC } from 'react';
// Redux Store
import { useSetNewPasswordMutation } from '../../store/api/auth-api-slice';
// Context
import { useThemeContext } from '../../context/ThemeContext';
import { useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonPage,
  IonHeader,
  IonIcon,
  IonCard,
} from '@ionic/react';
import { logIn, refreshCircleOutline } from 'ionicons/icons';
import InfoTextRegister from './InfoTextRegister';
import { CustomInput } from '../FormFields/CustomInput';

interface NewPasswordForm {
  email: string;
  password: string;
  repeatPassword: string;
}

const defaultNewPasswordForm: NewPasswordForm = {
  email: '',
  password: '',
  repeatPassword: '',
};

const SetNewPassword: VFC = () => {
  const { isDarkTheme } = useThemeContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultNewPasswordForm,
    criteriaMode: 'all', // get all errors
  });

  const { id } = useParams<{ id: string }>();

  const [isResetPasswordFinished, setIsResetPasswordFinished] = useState(false);

  const [triggerSetNewPassword, result] = useSetNewPasswordMutation();

  const onSubmit: SubmitHandler<NewPasswordForm> = async (data) => {
    const requestAnswer = await triggerSetNewPassword({
      resetToken: id,
      ...data,
    });

    if (requestAnswer.hasOwnProperty('data')) {
      setIsResetPasswordFinished(true);
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
          alt='Header App'
        />
      </IonHeader>
      <IonContent>
        {!isResetPasswordFinished && (
          <div className='container-content mt-5'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <IonItem lines='none' className='mb-1'>
                <CustomInput
                  control={control}
                  name='email'
                  label='E-Mail'
                  inputmode='email'
                  rules={{ required: 'Deine Mail-Adresse fehlt.' }}
                />
              </IonItem>

              <IonItem lines='none' className='mb-1'>
                <CustomInput
                  control={control}
                  name='password'
                  label='Passwort'
                  type='password'
                  rules={{
                    required: 'Trage ein Passwort ein.',
                    validate: {
                      number: (value) => /[0-9]/.test(value) || 'mindestens eine Ziffer [0-9]',
                      lowerCase: (value) =>
                        /[a-z]/.test(value) || 'mindestens einen kleinen Buchstaben [a-z]',
                      upperCase: (value) =>
                        /[A-Z]/.test(value) || 'mindestens einen großen Buchstaben [A-Z]',
                      length: (value) =>
                        /.{6,32}/.test(value) || 'mindestens 6 Stellen lang, maximal 32',
                    },
                  }}
                />
              </IonItem>
              <IonItem lines='none' className='mb-1'>
                <CustomInput
                  control={control}
                  name='repeatPassword'
                  label='Passwort wiederholen'
                  type='password'
                  rules={{
                    required: 'Trage ein Passwort ein.',
                    validate: {
                      number: (value) => /[0-9]/.test(value) || 'mindestens eine Ziffer [0-9]',
                      lowerCase: (value) =>
                        /[a-z]/.test(value) || 'mindestens einen kleinen Buchstaben [a-z]',
                      upperCase: (value) =>
                        /[A-Z]/.test(value) || 'mindestens einen großen Buchstaben [A-Z]',
                      length: (value) =>
                        /.{6,32}/.test(value) || 'mindestens 6 Stellen lang, maximal 32',
                    },
                  }}
                />
              </IonItem>

              <IonButton
                className='button--check button--check-large my-3 mx-5'
                type='submit'
                fill='clear'
                expand='block'
              >
                <IonIcon className='pe-1' icon={refreshCircleOutline} />
                Passwort erneuern
              </IonButton>
            </form>

            <InfoTextRegister passwordErrors={errors.password} />
          </div>
        )}

        {isResetPasswordFinished && (
          <div className='container-content--center'>
            <IonCard>
              <IonItem lines='full'>
                <IonLabel className='text-center ion-text-wrap'>
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

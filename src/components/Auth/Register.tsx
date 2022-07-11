import { useState, VFC } from 'react';
// Redux Store
import { useAppDispatch } from '../../store/hooks';
import { appActions } from '../../store/appSlice';
import { useRegisterUserMutation } from '../../store/api/auth-api-slice';
// Context
import { useThemeContext } from '../../context/ThemeContext';
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
import { magnetOutline } from 'ionicons/icons';
import { citiesInGermany } from '../../utils/citiesInGermany';
import InfoTextRegister from './InfoTextRegister';
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../../utils/variables-and-functions';
import { CustomInput } from '../FormFields/CustomInput';
import { useAutocompleteWithReducer } from '../../hooks/useAutocompleteWithUseReducer';
import AutocompleteList from '../Autocomplete/AutocompleteList';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
  city: string;
}

const defaultRegisterForm: RegisterForm = {
  name: '',
  email: '',
  password: '',
  repeatPassword: '',
  city: '',
};

const Register: VFC = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useThemeContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultRegisterForm,
    criteriaMode: 'all', // get all errors
  });
  const [finishRegistration, setFinishRegistration] = useState(false);

  const [triggerRegisterUser, result] = useRegisterUserMutation();

  const {
    value: inputValue,
    handleInputChange,
    hasSuggestions,
    suggestions,
    handleSelect,
    handleKeyDown,
    currentFocus,
  } = useAutocompleteWithReducer();

  const handleChange = (text: string) => handleInputChange(citiesInGermany, text);

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    dispatch(appActions.setIsLoading(true));
    try {
      const uri = encodeURI(data.city);
      const city = await fetch(`${GOOGLE_API_URL}${uri}${GOOGLE_API_URL_CONFIG}`);
      const { results } = await city.json();

      const home_city = {
        city: data.city,
        geo: {
          lat: results[0].geometry.location.lat || null,
          lng: results[0].geometry.location.lng || null,
        },
      };

      const serverAnswer = await triggerRegisterUser({
        name: data.name,
        email: data.email,
        password: data.password,
        repeatPassword: data.repeatPassword,
        home_city,
      });

      if (serverAnswer.hasOwnProperty('error')) {
        // TODO: Server Request Error in Modal ausgelagert lassen über setError
        dispatch(appActions.setError('E-Mail ist bereits im System hinterlegt.'));
        dispatch(appActions.setIsLoading(false));
        return setTimeout(() => dispatch(appActions.resetError()), 5000);
      }
      setFinishRegistration(true);
    } catch (err: any) {
      dispatch(appActions.setError(err.message));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    reset();
    dispatch(appActions.setIsLoading(false));
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
        {!finishRegistration && (
          <div className='container-content mt-5'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <IonItem lines='none' className='mb-1'>
                <CustomInput
                  control={control}
                  name='name'
                  label='Name'
                  rules={{ required: 'Trage einen Namen ein.' }}
                  isFocusedOnMount={true}
                />
              </IonItem>
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

              <IonItem lines='none' className='mb-1'>
                <CustomInput
                  control={control}
                  name='city'
                  label={
                    <>
                      Stadt <span className='span-small'>(für Startpunkt Karte)</span>
                    </>
                  }
                  rules={{
                    required:
                      'Du kannst die Stadt jederzeit im Profil ändern. Für die Kartenansicht wird eine Angabe gebraucht',
                  }}
                  onKeyDown={handleKeyDown}
                  onInputChange={handleChange}
                  externalValue={inputValue}
                />
              </IonItem>

              {hasSuggestions && (
                <AutocompleteList
                  suggestions={suggestions}
                  inputValue={inputValue}
                  currentFocus={currentFocus}
                  onSelect={handleSelect}
                />
              )}

              <IonButton
                className='button--check button--check-large my-3 mx-5'
                type='submit'
                fill='clear'
                expand='block'
              >
                <IonIcon className='pe-1' icon={magnetOutline} />
                Registrieren
              </IonButton>
            </form>

            <InfoTextRegister passwordErrors={errors.password} />
          </div>
        )}

        {finishRegistration && (
          <div className='container-content--center'>
            <IonCard>
              <IonItem lines='full' className='item--item-background'>
                <IonLabel className='text-center ion-text-wrap'>Registrierung erfolgreich</IonLabel>
              </IonItem>
              <p className='text-center ion-text-wrap px-2 my-2'>
                Du hast eine Mail erhalten. Klicke auf den Bestätigungs-Link. Kontrolliere auch den
                Spam-Ordner.
              </p>
              <IonButton
                fill='clear'
                className='button--check button--check-large my-3 mx-5'
                expand='block'
                routerLink='/home'
              >
                Zurück zur Startseite
              </IonButton>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Register;

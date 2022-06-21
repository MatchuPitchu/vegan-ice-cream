import { Controller, useForm } from 'react-hook-form';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userActions } from '../store/userSlice';
import { showActions } from '../store/showSlice';
import { appActions } from '../store/appSlice';
// Context
import { IonInput, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react';
import Error from './Error';
import { refreshCircle } from 'ionicons/icons';
import LoadingError from './LoadingError';
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables-and-functions';

const ProfilUpdate = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { error } = useAppSelector((state) => state.app);

  const defaultValues = {
    name: '',
    email: '',
    city: '',
    newPassword: '',
    repeatedPassword: '',
    password: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const fetchCity = async (city) => {
    try {
      const uri = encodeURI(city);
      const response = await fetch(`${GOOGLE_API_URL}${uri}${GOOGLE_API_URL_CONFIG}`);
      const { results } = await response.json();
      return [results?.[0]?.geometry?.location?.lat, results?.[0]?.geometry?.location?.lng];
    } catch (err) {
      dispatch(appActions.setError('Da ist etwas schief gelaufen. Versuche es später nochmal.'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
  };

  const onSubmit = async ({ name, email, city, newPassword, repeatedPassword, password }) => {
    if (!password) return;
    if (newPassword && newPassword !== repeatedPassword) {
      dispatch(appActions.setError('Neues Password stimmt nicht mit Wiederholung überein.'));
      return setTimeout(() => dispatch(appActions.setError('')), 5000);
    }

    dispatch(appActions.setIsLoading(true));

    try {
      let body = {
        password,
      };
      if (name && name !== user.name) body.name = name;
      if (email && email !== user.email) body.email = email;
      if (city === '') {
        body.home_city = {
          city: '',
          geo: {
            lat: 52.524,
            lng: 13.41,
          },
        };
      }
      if (city && city !== user.home_city.city) {
        const [lat, lng] = await fetchCity(city);
        body.home_city = {
          city,
          geo: {
            lat: lat || null,
            lng: lng || null,
          },
        };
      }
      if (newPassword) body.newPassword = newPassword;
      if (repeatedPassword) body.repeatedPassword = repeatedPassword;

      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token'),
        },
        body: JSON.stringify(body),
        credentials: 'include',
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}`, options);
      const { success } = await res.json();
      if (success) {
        dispatch(
          userActions.updateUser({
            name: body.name || user.name,
            email: body.email || user.email,
            home_city: body.home_city || user.home_city,
          })
        );
        dispatch(
          appActions.setSuccessMsg(
            `Update erfolgreich. ${
              email &&
              'Da du deine E-Mail wechselst, klicke bitte noch auf den Bestätigungs-Link in deinem Postfach. Kontrolliere auch den Spam-Ordner.'
            }`
          )
        );
        setTimeout(() => dispatch(appActions.setSuccessMsg('')), 10000);
        dispatch(showActions.setShowUpdateProfil(false));
        if (email) {
          dispatch(showActions.setShowProfil(false));
          dispatch(userActions.logout());
        }
      } else {
        dispatch(appActions.setError('Du hast ein falsches Passwort eingetragen'));
        setTimeout(() => dispatch(appActions.resetError()), 5000);
      }
    } catch (err) {
      console.log(err);
      dispatch(appActions.setError('Da ist etwas schief gelaufen. Versuche es später nochmal.'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    dispatch(appActions.setIsLoading(false));
  };

  return (
    <div className='text-center'>
      <IonItem lines='none'>
        <IonLabel className='ion-text-wrap'>
          Aktualisiere die Felder deiner Wahl und bestätige mit deinem Passwort
        </IonLabel>
      </IonItem>
      <form onSubmit={handleSubmit(onSubmit)}>
        <IonItem lines='full'>
          <IonLabel position='stacked' htmlFor='name'>
            Name
          </IonLabel>
          <Controller
            control={control}
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <IonInput
                type='text'
                inputmode='text'
                value={value}
                onIonChange={(e) => onChange(e.detail.value)}
              />
            )}
            name='name'
          />
        </IonItem>
        {Error('name', errors)}

        <IonItem lines='full'>
          <IonLabel position='stacked' htmlFor='email'>
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
          />
        </IonItem>
        {Error('email', errors)}

        <IonItem lines='full'>
          <IonLabel position='stacked' htmlFor='city'>
            Stadt <span className='span-small'>(für Startpunkt Karte)</span>
          </IonLabel>
          <Controller
            control={control}
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <IonInput
                type='text'
                inputmode='text'
                value={value}
                onIonChange={(e) => onChange(e.detail.value)}
              />
            )}
            name='city'
          />
        </IonItem>

        <IonItem lines='full'>
          <IonLabel position='stacked' htmlFor='newPassword'>
            Neues Passwort
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
            name='newPassword'
            rules={{
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                message: 'Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen',
              },
            }}
          />
        </IonItem>
        {Error('newPassword', errors)}

        <IonItem lines='full'>
          <IonLabel position='stacked' htmlFor='repeatedPassword'>
            Passwort wiederholen
          </IonLabel>
          <Controller
            control={control}
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
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                message: 'Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen',
              },
            }}
          />
        </IonItem>
        {Error('repeatedPassword', errors)}

        <IonItem lines='none'>
          <IonLabel position='stacked' htmlFor='password'>
            Aktuelles Passwort
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

        <IonItem lines='none'>
          <IonButton
            className='my-3 confirm-btn-block'
            type='submit'
            routerLink='/login'
            expand='block'
          >
            <IonIcon slot='end' className='pe-1' icon={refreshCircle} />
            Profil updaten
          </IonButton>
        </IonItem>
      </form>
      <LoadingError />
    </div>
  );
};

export default ProfilUpdate;

import { SubmitHandler, useForm } from 'react-hook-form';
import type { GeoCoordinates } from '../types/types';
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables-and-functions';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userActions } from '../store/userSlice';
import { showActions } from '../store/showSlice';
import { appActions } from '../store/appSlice';
import { IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react';
import { refreshCircle } from 'ionicons/icons';
import { CustomInput } from './FormFields/CustomInput';
import { useEffect } from 'react';

interface ProfilUpdateForm {
  name: string;
  email: string;
  city: string;
  newPassword: string;
  repeatedPassword: string;
  password: string;
}

const defaultFormValues: ProfilUpdateForm = {
  name: '',
  email: '',
  city: '',
  newPassword: '',
  repeatedPassword: '',
  password: '',
};

const defaultHomeCity = {
  city: '',
  geo: {
    lat: 52.524,
    lng: 13.41,
  },
};

interface SubmitBody {
  password: string;
  name?: string;
  email?: string;
  home_city?: {
    city: string;
    geo: GeoCoordinates;
  };
  newPassword?: string;
  repeatedPassword?: string;
}

const ProfilUpdate = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { error } = useAppSelector((state) => state.app);

  const { control, handleSubmit } = useForm({
    defaultValues: defaultFormValues,
  });

  const fetchCity = async (city: string): Promise<Record<string, number> | undefined> => {
    try {
      const uri = encodeURI(city);
      const response = await fetch(`${GOOGLE_API_URL}${uri}${GOOGLE_API_URL_CONFIG}`);
      const { results } = await response.json();
      return {
        lat: results?.[0]?.geometry?.location?.lat,
        lng: results?.[0]?.geometry?.location?.lng,
      };
    } catch (err) {
      dispatch(appActions.setError('Da ist etwas schief gelaufen. Versuche es später nochmal.'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
  };

  const onSubmit: SubmitHandler<ProfilUpdateForm> = async ({
    name,
    email,
    city,
    newPassword,
    repeatedPassword,
    password,
  }) => {
    if (!password || !user) return;
    if (newPassword && newPassword !== repeatedPassword) {
      dispatch(appActions.setError('Neues Password stimmt nicht mit Wiederholung überein.'));
      return setTimeout(() => dispatch(appActions.setError('')), 5000);
    }

    dispatch(appActions.setIsLoading(true));

    try {
      const body: SubmitBody = {
        password,
      };

      if (name && name !== user.name) body.name = name;
      if (email && email !== user.email) body.email = email;
      if (city === '') body.home_city = defaultHomeCity;
      if (city && city !== user.home_city.city) {
        const data = await fetchCity(city);
        if (data) {
          body.home_city = {
            city,
            geo: {
              lat: data.lat,
              lng: data.lng,
            },
          };
        }
      }
      if (newPassword) body.newPassword = newPassword;
      if (repeatedPassword) body.repeatedPassword = repeatedPassword;

      const token = localStorage.getItem('token');
      if (!token) return;

      const options: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
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
          <CustomInput control={control} name='name' label='Name' />
        </IonItem>

        <IonItem lines='full'>
          <CustomInput control={control} name='email' label='E-Mail' inputmode='email' />
        </IonItem>

        <IonItem lines='full'>
          <CustomInput
            control={control}
            name='city'
            label={
              <>
                Stadt <span className='span-small'>(für Startpunkt Karte)</span>
              </>
            }
          />
        </IonItem>

        <IonItem lines='full'>
          <CustomInput
            control={control}
            name='newPassword'
            label='Neues Passwort'
            type='password'
            rules={{
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                message: 'Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen',
              },
            }}
          />
        </IonItem>

        <IonItem lines='full'>
          <CustomInput
            control={control}
            name='repeatedPassword'
            label='Passwort wiederholen'
            type='password'
            rules={{
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                message: 'Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen',
              },
            }}
          />
        </IonItem>

        <IonItem lines='full'>
          <CustomInput
            control={control}
            name='password'
            label='Eingabe mit aktuellem Passwort bestätigen'
            type='password'
            rules={{ required: 'Bitte bestätige die Eingabe mit deinem Passwort.' }}
          />
          <IonButton
            className='my-3 button--confirm-block'
            fill='outline'
            type='submit'
            routerLink='/login'
            expand='block'
          >
            <IonIcon slot='end' className='pe-1' icon={refreshCircle} />
            Profil updaten
          </IonButton>
        </IonItem>

        {/* TODO: Brauch ich nicht mehr?! */}
        {error && <div className='message--alert'>{error}</div>}
      </form>
    </div>
  );
};

export default ProfilUpdate;

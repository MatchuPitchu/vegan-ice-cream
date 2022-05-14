import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
// Redux Store
import { userActions } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
// Context
import { Context } from '../context/Context';
import { IonInput, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react';
import showError from './showError';
import { refreshCircle } from 'ionicons/icons';
import LoadingError from './LoadingError';

const ProfilUpdate = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const { error, setError, setLoading, setShowProfil, setShowUpdateProfil, setSuccessMsg } =
    useContext(Context);

  const defaultValues = {
    name: '',
    email: '',
    city: '',
    newPassword: '',
    repeatPassword: '',
    password: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    if (data.newPassword && data.newPassword !== data.repeatPassword) {
      setError('Neues Password stimmt nicht mit Wiederholung überein.');
      return setTimeout(() => setError(''), 5000);
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      let body = {};
      if (!data.password) return setLoading(false);
      else body.password = data.password;
      if (data.name && data.name !== user.name) body.name = data.name;
      if (data.email && data.email !== user.email) body.email = data.email;
      if (data.city && data.city !== user.home_city.city) {
        try {
          const city = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
              data.city
            )}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          );
          const { results } = await city.json();
          if (data.city !== undefined)
            body.home_city = {
              city: data.city,
              geo: {
                lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
                lng: results[0].geometry.location ? results[0].geometry.location.lng : null,
              },
            };
        } catch (error) {
          console.log(error);
          setError('Da ist etwas schief gelaufen. Versuche es später nochmal.');
          return setTimeout(() => setError(null), 5000);
        }
      }
      if (data.newPassword) body.newPassword = data.newPassword;
      if (data.repeatPassword) body.repeatPassword = data.repeatPassword;

      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        // converts JS data into JSON string.
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
        // setUser({
        //   ...user,
        //   name: body.name || user.name,
        //   email: body.email || user.email,
        //   home_city: body.home_city || user.home_city,
        // });
        setSuccessMsg('Update erfolgreich');
        setTimeout(() => setSuccessMsg(''), 10000);
        setShowUpdateProfil(false);
        if (data.email) {
          setShowProfil(false);
          dispatch(userActions.logout());
        }
      } else {
        setError('Du hast ein falsches Passwort eingetragen');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.log(err);
      setError('Da ist etwas schief gelaufen. Versuche es später nochmal.');
      setTimeout(() => setError(null), 5000);
    }
    setLoading(false);
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
        {showError('name', errors)}

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
        {showError('email', errors)}

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
        {showError('newPassword', errors)}

        <IonItem lines='full'>
          <IonLabel position='stacked' htmlFor='repeatPassword'>
            Passwort wiederholen
          </IonLabel>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <IonInput
                type='password'
                id='repeatPassword'
                inputmode='text'
                value={value}
                onIonChange={(e) => onChange(e.detail.value)}
              />
            )}
            name='repeatPassword'
            rules={{
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                message: 'Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen',
              },
            }}
          />
        </IonItem>
        {showError('repeatPassword', errors)}

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
        {showError('password', errors)}
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

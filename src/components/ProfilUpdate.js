import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Context } from "../context/Context";
import { IonInput, IonItem, IonLabel, IonButton, IonIcon } from "@ionic/react";
import showError from './showError';
import { refreshCircle } from "ionicons/icons";
import LoadingError from "./LoadingError";

const ProfilUpdate = () => {
  const { error, setError, setLoading, user } = useContext(Context);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [successMsg, setSuccessMsg] = useState('');

  const onSubmit = async data => {
    if(data.newPassword && data.newPassword !== data.repeatPassword) {
      setError('Neues Password stimmt nicht mit Wiederholung überein.');
      return setTimeout(() => setError(''), 5000);
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      let body = {}
      if(!data.password) return;
        else body.password = data.password;
      if(data.name && data.name !== user.name) body.name = data.name;
      if(data.email && data.email !== user.email) body.email = data.email; 
      if(data.city && data.city !== user.home_city.city) {
        try {
          const city = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(data.city)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
          const { results } = await city.json();
          body.home_city = {
            city: data.city,
            geo: {
              lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
              lng: results[0].geometry.location ? results[0].geometry.location.lng : null
            }
          }
        } catch (error) {
          console.log(error);
          setError('Da ist etwas schief gelaufen. Versuche es später nochmal.')
          return setTimeout(() => setError(null), 5000);
        }
      }
      if(data.newPassword) body.newPassword = data.newPassword;
      if(data.repeatPassword) body.repeatPassword = data.repeatPassword;

      console.log('body', body);
      
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token
        },
        // converts JS data into JSON string.
        body: JSON.stringify(body),
        credentials: "include",
      };
      console.log(options);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}`, options);
      const { success } = await res.json();
      if(success) {
        setSuccessMsg('Update erfolgreich')
      } else {
        setError('Da ist etwas schief gelaufen. Versuche es später nochmal.');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.log(error);
      setError('Da ist etwas schief gelaufen. Versuche es später nochmal.')
      setTimeout(() => setError(null), 5000);
    };
    setLoading(false);
  };

  return (
    <div className="ion-padding text-center">
      <div>Aktualisiere die Felder deiner Wahl und bestätige mit deinem Passwort</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <IonItem lines="full">
          <IonLabel position='floating' htmlFor="name">Name</IonLabel>
          <Controller 
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
              )}
              name="name"
            />
        </IonItem>
        {showError("name", errors)}

        <IonItem lines="full">
          <IonLabel position='floating' htmlFor="email">E-Mail</IonLabel>
          <Controller 
            control={control}
            render={({ field: { onChange, value } }) => (
              <IonInput type="email" inputmode="email" value={value} onIonChange={e => onChange(e.detail.value)} />
              )}
              name="email"
            />
        </IonItem>
        {showError("email", errors)}

        <IonItem lines="full">
          <IonLabel position='floating' htmlFor="city">Stadt <span className="span-small">(für deine Kartenansicht)</span></IonLabel>
          <Controller 
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
              )}
            name="city"
          />
        </IonItem>

        <IonItem lines="full">
          <IonLabel position='floating' htmlFor="newPassword">Neues Passwort</IonLabel>
          <Controller 
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <IonInput type="password" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
              )}
              name="newPassword"
              rules={{ 
                pattern: {
                  value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                  message: "Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen"
                } 
              }}
            />
          </IonItem>
          {showError("newPassword", errors)}

          <IonItem lines="full">
            <IonLabel position='floating' htmlFor="repeatPassword">Passwort wiederholen</IonLabel>
            <Controller 
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <IonInput type="password" id="repeatPassword" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                )}
                name="repeatPassword"
                rules={{
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                    message: "Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen"
                  } 
                }}
              />
          </IonItem>
          {showError("repeatPassword", errors)}
        
          <IonItem lines="none">
            <IonLabel position='floating' htmlFor="password">Aktuelles Passwort</IonLabel>
            <Controller 
              control={control}
              render={({ 
                field: { onChange, value },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <IonInput type="password" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                )}
                name="password"
                rules={{ required: true }}
                />
            </IonItem>
          {showError("password", errors)}
          {error && <div className='alertMsg'>{error}</div>}
          {successMsg && <div className='successMsg'>{successMsg}</div>}

        <IonButton className="my-3 confirm-btn" type="submit" routerLink='/login' expand="block">
          <IonIcon slot="end" className="pe-1"icon={refreshCircle}/>Profil updaten
        </IonButton>
      </form>
      <div>Falls du eine neue E-Mail eingetragen hast, solltest du einen Link zum Bestätigen deiner neuen Mailadresse erhalten haben.</div>
      <LoadingError />
    </div>
  );
};

export default ProfilUpdate;
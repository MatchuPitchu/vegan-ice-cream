import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { Context } from "../context/Context";
import { IonContent, IonInput, IonItem, IonLabel, IonButton, IonPage, IonHeader, IonIcon, IonCard, IonCardContent, IonCardTitle } from "@ionic/react";
import showError from './showError';
import { refreshCircle } from "ionicons/icons";
import LoadingError from "./LoadingError";

const ProfilUpdate = () => {
  const { error, setError, toggle } = useContext(Context);
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async data => {
    try {
      // const options = {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   // converts JS data into JSON string.
      //   body: JSON.stringify(data),
      //   credentials: "include",
      // };
      // const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password`, options);
      // const { message } = await res.json();
      // if(!message) {
      //   setError('Prüfe, ob du deine richtige Mailadresse eingetippt hast.');
      //   setTimeout(() => setError(null), 5000);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ion-padding text-center">
      <div>Update nach deinen Wünschen</div>
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
              rules={{ required: true }}
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
              rules={{ required: true }}
              />
        </IonItem>
        {showError("email", errors)}

        <IonItem lines="full">
          <IonLabel position='floating' htmlFor="home_city">Stadt <span className="span-small">(für deine Kartenansicht)</span></IonLabel>
          <Controller 
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
              )}
            name="home_city"
            rules={{ required: true }}
          />
        </IonItem>

        <IonItem lines="full">
          <IonLabel position='floating' htmlFor="password">Neues Passwort</IonLabel>
          <Controller 
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <IonInput type="password" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
              )}
              name="password"
              rules={{ 
                required: true,
                pattern: {
                  value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                  message: "Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen"
                } 
              }}
            />
          </IonItem>
          {showError("password", errors)}

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
                  required: true,
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                    message: "Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen"
                  } 
                }}
              />
          </IonItem>
          {showError("repeatPassword", errors)}
        
          <IonItem lines="none">
            <IonLabel position='floating' htmlFor="password">Altes Passwort</IonLabel>
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
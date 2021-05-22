import { useContext, useState, useEffect } from 'react';
import { Context } from "../../context/Context";
import { useParams} from 'react-router-dom';
import { Controller, useForm } from "react-hook-form";
import { IonContent, IonInput, IonItem, IonLabel, IonList, IonButton, IonPage, IonHeader, IonIcon } from "@ionic/react";
import { Redirect } from "react-router-dom";
import showError from '../showError';
import { logIn } from "ionicons/icons";

const SetNewPassword = () => {
  const { toggle, error, setError } = useContext(Context);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { id } = useParams();
  const [ endReset, setEndReset ] = useState(false)

  const onSubmit = async ({ email, password, repeatPassword }) => {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resetToken: id,
        email,
        password,
        repeatPassword
      }),
      credentials: "include",
    };
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/new-password`, options);
      const { message } = await res.json();
      if (message) setEndReset(true);
    } catch (error) {
      setError(error)
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
    <IonContent>
      <div className="container mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem lines="none" className="mb-1">
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

          <IonItem lines="none" className="mb-1">
            <IonLabel position='floating' htmlFor="password">Passwort</IonLabel>
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

          <IonItem lines="none" className="mb-1">
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
          {error && <div className='alertMsg'>{error}</div>}       
        
          <IonButton className="my-3 confirm-btn" type="submit" expand="block">
            <IonIcon className="pe-1" icon={logIn}/>Passwort erneuern
          </IonButton>
          {endReset && (
            <IonButton className="check-btn" routerLink="/login" color="success" expand="block">
              Du hast dein Passwort erfolgreich erneuert und kannst dich wieder einloggen.
            </IonButton>
          )}
        </form>

        <p className="mt-4">
          <IonList>
            <IonItem lines="full">
              <IonLabel color="primary">Hinweise zur Wahl des Passworts</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>mindestens eine Ziffer [0-9]</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>mindestens einen kleinen Buchstaben [a-z]</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>mindestens einen großen Buchstaben [A-Z]</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>mindestens 6 Stellen lang, maximal 32</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel className="ion-text-wrap" color="warning">Dein Passwort wird verschlüsselt in der Datenbank gespeichert und ist für niemanden einzusehen</IonLabel>
            </IonItem>
          </IonList>
        </p>
      </div>
    </IonContent>
  </IonPage>
  )
}

export default SetNewPassword
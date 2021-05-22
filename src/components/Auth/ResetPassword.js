import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Context } from "../../context/Context";
import { IonContent, IonInput, IonItem, IonLabel, IonButton, IonPage, IonHeader, IonIcon, IonCard, IonCardContent, IonCardTitle } from "@ionic/react";
import showError from '../showError';
import { refreshCircle } from "ionicons/icons";
import LoadingError from "../LoadingError";

const ResetPassword = () => {
  const { setError, toggle } = useContext(Context);
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async data => {
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // converts JS data into JSON string.
        body: JSON.stringify(data),
        credentials: "include",
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password`, options);
      const { message } = await res.json();
      if(!message) {
        setError('Prüfe, ob du deine richtige Mailadresse eingetippt hast.');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <div className="container mt-3">
          <IonCard className="text-center">
            <IonCardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonItem lines="none">
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
                
                <IonButton className="my-3 confirm-btn" type="submit" routerLink='/login' expand="block">
                  <IonIcon slot="end" className="pe-1"icon={refreshCircle}/>Passwort zurücksetzen
                </IonButton>
              </form>
              <div>Schau nach dem Klick auf den Button in dein Mailpostfach. Du solltest einen Link zum Zurücksetzen deines Passworts erhalten haben.</div>
            </IonCardContent>
          </IonCard>
        </div>
        <LoadingError />
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
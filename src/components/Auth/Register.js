import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Context } from "../../context/Context";
import { IonContent, IonInput, IonItem, IonLabel, IonList, IonButton, IonPage, IonHeader, IonIcon } from "@ionic/react";
import { Redirect } from "react-router-dom";
import showError from '../showError';
import { logIn } from "ionicons/icons";

const Register = () => {
  const { 
    isAuth, 
    setIsAuth, setUser, 
    error, setError, 
    toggle 
  } = useContext(Context);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [endRegister, setEndRegister] = useState(false);

  const onSubmit = async data => {
    try {
      const city = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(data.city)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
      const { results } = await city.json();
      const home_city = {
        city: data.city,
        geo: {
          lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
          lng: results[0].geometry.location ? results[0].geometry.location.lng : null
        }
      }
      delete data.city;
      const newData = { ...data, home_city }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
        credentials: "include",
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, options);
      const { error } = await res.json();
      if (error) {
        setError('E-Mail ist bereits im System hinterlegt');
        return setTimeout(() => setError(''), 5000);
      } 

      setEndRegister(true);
      
    } catch (error) {
      setError(error)
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/header-login-dark.svg" : "./assets/header-login-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <div className="container mt-5">
          <form onSubmit={handleSubmit(onSubmit)}>
              <IonItem lines="none" className="mb-1">
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

              <IonItem lines="none" className="mb-1">
                <IonLabel position='floating' htmlFor="email">E-Mail</IonLabel>
                <Controller 
                  control={control}
                  defaultValue=""
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

              <IonItem lines="none" className="mb-1">
                <IonLabel position='floating' htmlFor="city">Stadt <span className="span-small">(für Startpunkt Karte)</span></IonLabel>
                <Controller 
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                    )}
                  name="city"
                  rules={{ required: true }}
                />
              </IonItem>    
              {!endRegister ? (
                <IonButton className="my-3 confirm-btn" type="submit" expand="block">
                  <IonIcon className="pe-1" icon={logIn}/>Registrieren
                </IonButton>
              ) : ( 
                <IonButton className="my-3 check-btn" routerLink="/home" color="success" expand="block">
                  Du hast eine Mail erhalten. Schau bitte auch in deinen Spam-Ordner.
                </IonButton>
              )}
          </form>

          <p className="text-center">Nach der Registrierung kannst du neue Eisläden eintragen, bewerten und zu deinen Favoriten hinzufügen.</p>
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
  );
};

export default Register;
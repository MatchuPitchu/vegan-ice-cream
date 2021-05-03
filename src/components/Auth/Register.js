import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { Context } from "../../context/Context";
import { IonContent, IonInput, IonItem, IonLabel, IonList, IonButton, IonPage, IonHeader, IonTitle, IonIcon, IonModal } from "@ionic/react";
import { Redirect } from "react-router-dom";
import showError from '../showError';
import { closeCircleOutline, logIn } from "ionicons/icons";

const Register = () => {
  const { isAuth, setIsAuth, setUser, error, setError, showModal, setShowModal, toggle, enterAnimation, leaveAnimation } = useContext(Context);
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async data => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    };
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, options);
      console.log(res);
      const { success, user, token } = await res.json();
      if (!success) {
        setError(success);
        console.log(success);
        return () => setTimeout(setError(''), 5000);
      } else if (token) {
        localStorage.setItem('token', token);
        setIsAuth(true);
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // REDIRECT TO PROFIL PAGE
  if (isAuth) return <Redirect to="/profil" />;

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <div className="container-sm mt-3">
          <form onSubmit={handleSubmit(onSubmit)}>
              <IonItem lines="none" className="mb-1">
                <IonLabel position='floating' htmlFor="name">Name</IonLabel>
                <Controller 
                  control={control}
                  defaultValue=""
                  render={({ 
                    field: { onChange, value },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
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
                  render={({ 
                    field: { onChange, value },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
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
                  render={({ 
                    field: { onChange, value },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
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
                  render={({ 
                    field: { onChange, value },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
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
            <IonButton className="my-3" type="submit" expand="block"><IonIcon className="pe-1"icon={logIn}/>Registrieren</IonButton>
          </form>
          <p>Nach der Registrierung kannst du neue Eisläden eintragen, bewerten und zu deinen Favoriten hinzufügen.</p>
          <p className="mt-5">
            <IonList>
              <IonItem disabled lines="full">
                <IonLabel color="primary">Hinweise zur Wahl des Passworts</IonLabel>
              </IonItem>
              <IonItem disabled lines="none">
                <IonLabel>mindestens eine Ziffer [0-9]</IonLabel>
              </IonItem>
              <IonItem disabled lines="none">
                <IonLabel>mindestens einen kleinen Buchstaben [a-z]</IonLabel>
              </IonItem>
              <IonItem disabled lines="none">
                <IonLabel>mindestens einen großen Buchstaben [A-Z]</IonLabel>
              </IonItem>
              <IonItem disabled lines="none">
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
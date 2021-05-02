import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { Context } from "../../context/Context";
import { IonContent, IonInput, IonItem, IonLabel, IonList, IonButton, IonPage, IonHeader, IonTitle, IonIcon } from "@ionic/react";
import { Redirect } from "react-router-dom";
import showError from '../showError';
import { logIn } from "ionicons/icons";

const Login = () => {
  const { isAuth, setIsAuth, error, setError, toggle } = useContext(Context);
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm();

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
      const res = await fetch(
        "http://localhost:5000/auth/login",
        options
      );
      const { success, id, userName, token } = await res.json();
      console.log(success, id, userName, token);
      //set this to session storage
      // if (sucess) {
      //   setError(sucess);
      //   console.log(sucess);
      //   return () => setTimeout(setError(""), 5000);
      // };
      // if (token) {
      //   localStorage.setItem("token", token);
      //   setIsAuth(true);
      // };
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuth) return <Redirect to="/" />;

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent fullscreen>
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)}>
              <IonItem lines="none" className="mb-1">
                <IonLabel position='floating' htmlFor="email">E-Mail</IonLabel>
                <Controller 
                  control={control}
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
            <IonButton className="my-3" type="submit" expand="block"><IonIcon className="pe-1"icon={logIn}/>Login</IonButton>
          </form>
          <p>Nach dem Einloggen kannst du neue Eisläden eintragen, Eisläden bewerten und zu deinen Favoriten hinzufügen.</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
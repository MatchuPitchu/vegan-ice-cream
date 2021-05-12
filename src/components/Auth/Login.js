import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { Context } from "../../context/Context";
import { IonContent, IonInput, IonItem, IonLabel, IonList, IonButton, IonPage, IonHeader, IonTitle, IonIcon } from "@ionic/react";
import { Redirect } from "react-router-dom";
import showError from '../showError';
import { logIn } from "ionicons/icons";

const Login = () => {
  const { isAuth, setIsAuth, error, setError, user, setUser, toggle } = useContext(Context);
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async data => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // converts JS data into JSON string.
        body: JSON.stringify(data),
        credentials: "include",
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, options);
      const { success, user, token } = await res.json();
      if (success) {
        const options = {
          headers: { token },
          credentials: "include"
        }; 
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/infos`, options);
        const data = await res.json();
        localStorage.setItem('token', token);
        setUser({ ...user, ...data});
        setIsAuth(true);
      } else {
        setError('Prüfe, ob du das richtige Passwort eingetragen hast')
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuth) return <Redirect exact to="/home" />;

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <div className="container mt-3">
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
              {error && <div className='alertMsg'>{error}</div>}
              
              <IonButton className="my-3 confirm-btn" type="submit" expand="block">
                <IonIcon className="pe-1"icon={logIn}/>Login
              </IonButton>
          </form>
          <p>Nach dem Einloggen kannst du neue Eisläden eintragen, bewerten und zu deinen Favoriten hinzufügen.</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
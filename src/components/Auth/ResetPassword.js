import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { Context } from "../../context/Context";
import { IonContent, IonInput, IonItem, IonLabel, IonButton, IonPage, IonHeader, IonIcon } from "@ionic/react";
import showError from '../showError';
import { refreshCircle } from "ionicons/icons";
import LoadingError from "../LoadingError";

const ResetPassword = () => {
  const { isAuth, setIsAuth, error, setError, user, setUser, toggle } = useContext(Context);
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async data => {
    // try {
    //   const options = {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     // converts JS data into JSON string.
    //     body: JSON.stringify(data),
    //     credentials: "include",
    //   };
    //   const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, options);
    //   const { success, user, token } = await res.json();
    //   if(user.confirmed) {
    //     const options = {
    //       headers: { token },
    //       credentials: "include"
    //     }; 
    //     const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/infos`, options);
    //     const data = await res.json();
    //     localStorage.setItem('token', token);
    //     setUser({ ...user, ...data});
    //     setIsAuth(true);
    //   } else {
    //     setError('Prüfe, ob du das richtige Passwort eingetippt hast oder ob du deine Mailadresse bestätigt hast.');
    //     setTimeout(() => setError(null), 5000);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

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
                render={({ field: { onChange, value } }) => (
                  <IonInput type="email" inputmode="email" value={value} onIonChange={e => onChange(e.detail.value)} />
                  )}
                  name="email"
                  rules={{ required: true }}
                  />
            </IonItem>
            {showError("email", errors)}
            
            <IonButton className="my-3 confirm-btn" type="submit" expand="block">
              <IonIcon slot="end" className="pe-1"icon={refreshCircle}/>Passwort zurücksetzen
            </IonButton>
          </form>
        </div>
        <LoadingError />
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
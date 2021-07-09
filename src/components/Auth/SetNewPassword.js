import { useContext, useState } from 'react';
import { Context } from "../../context/Context";
import { useParams} from 'react-router-dom';
import { Controller, useForm } from "react-hook-form";
import { IonContent, IonInput, IonItem, IonLabel, IonList, IonButton, IonPage, IonHeader, IonIcon, IonCard, IonCardContent, IonCardTitle } from "@ionic/react";
import showError from '../showError';
import { logIn } from "ionicons/icons";
import LoadingError from '../LoadingError';
import InfoTextRegister from './InfoTextRegister';

const SetNewPassword = () => {
  const { toggle, setLoading, error, setError } = useContext(Context);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { id } = useParams();
  const [ endReset, setEndReset ] = useState(false)

  const onSubmit = async ({ email, password, repeatPassword }) => {
    setLoading(true);
    try {
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/new-password`, options);
      const { message } = await res.json();
      if (message) setEndReset(true);
    } catch (error) {
      setError(error)
      setTimeout(() => setError(null), 5000);
    }
    setLoading(false)
  };

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/header-login-dark.svg" : "./assets/header-login-light.svg"}`} />
      </IonHeader>
      <IonContent>
        {!endReset ? (
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
            </form>

            <InfoTextRegister />

          </div>
        ) : (
          <div className="container text-center">
            <IonCard>
              <IonItem lines="full">
                <IonLabel className="text-center ion-text-wrap" color="primary">Passwort erfolgreich erneuert</IonLabel>
              </IonItem>
              <IonButton className="my-3 confirm-btn" routerLink="/login" fill="solid">
                <IonIcon className="pe-1" icon={logIn}/>Login
              </IonButton>
            </IonCard>
          </div>
        )}
      
      <LoadingError />

      </IonContent>
    </IonPage>
  )
}

export default SetNewPassword
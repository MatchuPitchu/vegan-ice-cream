import { useContext } from "react";
import { Context } from "../../context/Context";
import { IonContent, IonPage, IonHeader, IonItem, IonCard, IonCardTitle, IonCardContent } from "@ionic/react";

const Login = () => {
  const { toggle } = useContext(Context);

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/header-home-dark.svg" : "./assets/header-home-light.svg"}`} />
      </IonHeader>
      <IonContent>
      </IonContent>
        <div className="container text-center">
          <IonCard>
            <IonCardContent>
            <IonCardTitle className="mb-3">Logout erfolgreich</IonCardTitle>
              Melde dich wieder an, wenn du neue Eisläden eintragen, bewerten und zu deinen Favoriten hinzufügen möchtest.
            </IonCardContent>
          </IonCard>
        </div>
    </IonPage>
  );
};

export default Login;
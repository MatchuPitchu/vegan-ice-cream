import { useContext } from "react";
import { Context } from "../../context/Context";
import { IonContent, IonPage, IonHeader } from "@ionic/react";

const Login = () => {
  const { toggle } = useContext(Context);

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <div className="container">
          <h4>Du hast dich erfolgreich ausgeloggt</h4>
          <p>Melde dich wieder an, wenn du neue Eisläden eintragen, bewerten und zu deinen Favoriten hinzufügen möchtest.</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
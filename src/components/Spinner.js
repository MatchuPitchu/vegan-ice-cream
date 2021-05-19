import { useContext } from "react";
import { Context } from "../context/Context";
// import spinner
import { css } from "@emotion/core";
import { RingLoader } from "react-spinners";
import { IonButton, IonIcon, IonLabel } from "@ionic/react";
import { create, logIn } from "ionicons/icons";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: flex;
  margin: 30px auto;
  background-color: transparent;
  opacity: 0.8;
`;

const Spinner = () => {
  const { isAuth, toggle, activateMessage } = useContext(Context);

  if (activateMessage === 'Aktivierung des Mail-Accounts erfolgreich') 
    return (
    <div className="d-flex flex-column align-items-center">
      <RingLoader color="var(--ion-color-primary)" css={override} size={120} />
      <h3 style={{ fontSize: "1.3em" }} className="display-3">
        {activateMessage}
      </h3>
      <IonButton routerLink='/login' fill="solid" className="disabled-btn my-3">
        <IonLabel>Login</IonLabel>
        <IonIcon className="pe-1" icon={logIn} />
      </IonButton>
    </div>
  );

  return (
    <div className="d-flex flex-column align-items-center">
      <RingLoader color="var(--ion-color-primary)" css={override} size={120} />
      <h3 style={{ fontSize: "1.3em" }} className="display-3">
        {isAuth ? 'Loading ...' : 'Nur für eingeloggte User sichtbar'} 
      </h3>
      {!isAuth ? (
        <div>
          <IonButton routerLink='/login' fill="solid" className="disabled-btn my-3">
            <IonLabel>Login</IonLabel>
            <IonIcon className="pe-1" icon={logIn} />
          </IonButton>
          <IonButton routerLink='/register' fill="solid" className="disabled-btn my-3">
            <IonLabel>Registrieren</IonLabel>
            <IonIcon className="pe-1" icon={create} />
          </IonButton>
        </div>
      ) : null}
    </div>
  );
};

export default Spinner;
import { useContext } from 'react';
import { Context } from "../context/Context";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Eintragen = () => {
  const { toggle } = useContext(Context);

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Eintragen</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Eintragen;

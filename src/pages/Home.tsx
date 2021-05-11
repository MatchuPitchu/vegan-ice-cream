import { useContext } from "react";
import { Context } from "../context/Context";
import { IonButton, IonContent, IonHeader, IonIcon, IonPage } from '@ionic/react';
import { iceCream } from 'ionicons/icons';
// import Search from '../components/Search';

const Home: React.FC = () => {
  const { toggle } = useContext(Context);

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/header-home-dark.svg" : "./assets/header-home-light.svg"}`} />
      </IonHeader>
      <IonContent className="home">
        <div className="run-text">
          <h1 className="title">
            veganes Eis<br />
            <div className="run-text-wrapper">
              <div className="run-text-words" aria-hidden="true">
                <strong className="run-text-word">entdecken</strong>
                <strong className="run-text-word">genießen</strong>
                <strong className="run-text-word">eintragen</strong>
              </div>
              <div className="run-text-final">entdecken</div>
              <div className="run-text-final">genießen</div>
              <div className="run-text-final">eintragen</div>
            </div>
          </h1>
          <div className="overlay">
            <IonIcon className="startIceIcon" icon={iceCream} />
          </div>
          <IonButton className="start-btn-wrapper" routerLink="/entdecken" fill="clear">
            <div className="start-btn-container">
              <a role="button">
                <span className="btn-ring"></span>
                <span className="btn-border"></span>
                <span className="btn-text">Start</span>
              </a>
            </div>
          </IonButton>
        </div>

        {/* <Search /> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;

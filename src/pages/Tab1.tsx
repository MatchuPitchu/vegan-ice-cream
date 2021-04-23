import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="rotate-text">
          <h1>
            Veganes Eis
          </h1>
          <h2>
            <div className="rotate-text-wrapper">
              <div className="rotate-text-words" aria-hidden="true">
                <strong className="rotate-text-word">entdecken</strong>
                <strong className="rotate-text-word">essen</strong>
                <strong className="rotate-text-word">eintragen</strong>
              </div>
            </div>
          </h2>
        </div>
        <ExploreContainer name="Tab 1 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

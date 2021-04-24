import { IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { iceCream } from 'ionicons/icons';

const TabStart: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="tabStart" fullscreen >
        <div className="rotate-text">
          <h1 className="title">
            veganes Eis<br />
            <div className="rotate-text-wrapper">
              <div className="rotate-text-words" aria-hidden="true">
                <strong className="rotate-text-word">entdecken</strong>
                <strong className="rotate-text-word">essen</strong>
                <strong className="rotate-text-word">eintragen</strong>
              </div>
              <div className="rotate-text-final">entdecken</div>
              <div className="rotate-text-final">essen</div>
              <div className="rotate-text-final">eintragen</div>
            </div>
          </h1>
          <div className="overlay"><IonIcon className="startIceIcon" icon={iceCream} /></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TabStart;

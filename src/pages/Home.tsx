import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { iceCream } from 'ionicons/icons';
import Search from '../components/Search';
import Searchbar from '../components/Searchbar';

const Home: React.FC = () => {
  return (
    <IonPage>
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
          <div className="start-btn-container">
            <a href="#" role="button">
              <span className="btn-ring"></span>
              <span className="btn-border"></span>
              <span className="btn-text">Start</span>
            </a>
          </div>
        </div>

        <Searchbar/>

        {/* <Search /> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;

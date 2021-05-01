import { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToolbar,
  IonSearchbar,
  IonMenu,
  IonPage,
  IonButtons,
  IonButton,
  IonContent
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { menuController } from '@ionic/core';
import { alarmOutline, bookmarks, disc, discOutline, ellipse, home, homeOutline, iceCream, iceCreamSharp, menu, square, triangle } from 'ionicons/icons';
import Menu from './components/Menu';
import Home from './pages/Home';
import Entdecken from './pages/Entdecken.js';
import Eintragen from './pages/Eintragen';
import Favoriten from './pages/Favoriten';
import Feedback from './components/Feedback';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Bootstrap, Theme variables, leaflet css, custom CSS */
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme/variables.css';
import './App.css'

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  return (
  <IonApp>
    <IonHeader>
      <IonToolbar className="toolbarHeader">
        <IonSearchbar className="searchbar" type="search" value={searchText} onIonChange={e => setSearchText(e.detail.value!)} placeholder="Stadt" showCancelButton="always" 	cancel-button-text="" />
        <IonButtons slot="primary" >
          <IonButton fill="clear" >
            <IonIcon icon={alarmOutline} />
          </IonButton>
          <IonButton fill="clear" onClick={ async () => await menuController.toggle()}>
            <IonIcon icon={menu} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonMenu contentId="settings" type="overlay" swipeGesture={true}>
      <Menu />
    </IonMenu>
    <IonPage id="settings"></IonPage>
    
    <IonContent>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
            <Route path="/home" component={Home} exact={true} />
            <Route path="/entdecken" component={Entdecken} exact={true} />
            <Route path="/eintragen" component={Eintragen} exact={true} />
            <Route path="/favoriten" component={Favoriten} exact={true} />
            <Route path="/feedback" component={Feedback} exact={true} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel className="labelTabs">Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="entdecken" href="/entdecken">
              <IonIcon icon={disc} />
              <IonLabel className="labelTabs">Entdecken</IonLabel>
            </IonTabButton>
            <IonTabButton tab="eintragen" href="/eintragen">
              <IonIcon icon={iceCream} />
              <IonLabel className="labelTabs">Eis eintragen</IonLabel>
            </IonTabButton>
            <IonTabButton tab="favoriten" href="/favoriten">
              <IonIcon icon={bookmarks} />
              <IonLabel className="labelTabs">Favoriten</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonContent>
  </IonApp>
  )
}

export default App;
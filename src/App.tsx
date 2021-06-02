import { useContext } from 'react';
import { Context } from "./context/Context";
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonContent,
  IonBadge
} from '@ionic/react';
import { bookmarks, disc, home, iceCream } from 'ionicons/icons';
import HeaderApp from './components/HeaderApp';
import Home from './pages/Home';
import Entdecken from './pages/Entdecken';
import Bewerten from './pages/Bewerten';
import Favoriten from './pages/Favoriten';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ActivateUser from './components/Auth/ActivateUser';
import Logout from './components/Auth/Logout';


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
import ResetPassword from './components/Auth/ResetPassword';
import SetNewPassword from './components/Auth/SetNewPassword';
import Datenschutz from './pages/Datenschutz';

const App: React.FC = () => {
  const { user } = useContext(Context);

  return (
    <IonApp>
      <IonReactRouter>
        
        <HeaderApp />
      
        <IonContent>
          <IonTabs>
            <IonRouterOutlet>
              <Redirect from="/" to="/home" exact />
              <Route path="/home" component={Home} exact />
              <Route path="/entdecken" component={Entdecken} exact />
              <Route path="/bewerten" component={Bewerten} exact />
              <Route path="/favoriten" component={Favoriten} exact />
              <Route path="/login" component={Login} exact />
              <Route path="/register" component={Register} exact />
              <Route path="/logout" component={Logout} exact/>
              <Route path="/auth/activate/user/:id" component={ActivateUser} exact/>
              <Route path="/auth/reset-password" component={ResetPassword} exact/>
              <Route path="/auth/reset-password/user/:id" component={SetNewPassword} exact/>
              <Route path="/datenschutz" component={Datenschutz} exact/>
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
              <IonTabButton tab="bewerten" href="/bewerten">
                <IonIcon icon={iceCream} />
                <IonLabel className="labelTabs">Bewerten</IonLabel>
              </IonTabButton>
              <IonTabButton tab="favoriten" href="/favoriten">
                <IonIcon icon={bookmarks} />
                <IonLabel className="labelTabs">Favoriten</IonLabel>
                {user && (
                  <IonBadge color="secondary">{user.favorite_locations.length || 0}</IonBadge>
                )}
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonContent>
      </IonReactRouter>
    </IonApp>
  )
}

export default App;
import { lazy, Suspense } from 'react';
import { Redirect, Route } from 'react-router-dom';
// Redux Store
import { useAppSelector } from './store/hooks';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonContent,
  IonBadge,
} from '@ionic/react';
import { flagOutline, homeOutline, mapOutline, starHalfOutline } from 'ionicons/icons';
import HeaderApp from './components/HeaderApp';
import Home from './pages/Home';
import Entdecken from './pages/Entdecken';
import Bewerten from './pages/Bewerten';
import Favoriten from './pages/Favoriten';

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

/* Bootstrap, Theme variables, custom CSS */
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme/variables.css';
import './App.css';

// RTK Query
// How to use RTK hooks: https://redux-toolkit.js.org/tutorials/rtk-query#create-an-api-service
// NOTICE: RTK Query ensures that any component that subscribes to the same query will always use the same data.
// TODO: überall error messages und loading state catchen und in state speichern für Anzeige Loading Spinner + Notification Toast durch NotificationProvider

// TODO: Readme with Information about project and Deploy in Google Playstore

const Login = lazy(() => import('./pages/Auth/Login'));
const Logout = lazy(() => import('./pages/Auth/Logout'));
const Register = lazy(() => import('./pages/Auth/Register'));
const UserActivation = lazy(() => import('./pages/Auth/UserActivation'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const SetNewPassword = lazy(() => import('./pages/Auth/SetNewPassword'));
const Datenschutz = lazy(() => import('./pages/Datenschutz'));
const IosDescription = lazy(() => import('./pages/IosDescription'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Beitragen = lazy(() => import('./pages/Beitragen'));

const App: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);

  // to display notification if update available (see ServiceWorkerWrapper.js)
  // without reload of page
  // const history = useHistory();
  // useEffect(() => {
  //   history.listen((location, action) => {
  //     // check for sw updates on page change
  //     navigator.serviceWorker
  //       .getRegistrations()
  //       .then((regs) => regs.forEach((reg) => reg.update()));
  //   });
  // }, []);

  return (
    <IonApp>
      <HeaderApp />

      <Suspense fallback={<div className='spinner' />}>
        <IonContent>
          <IonTabs>
            <IonRouterOutlet>
              <Redirect from='/' to='/home' exact />
              <Route path='/home' component={Home} exact />
              <Route path='/entdecken' component={Entdecken} exact />
              <Route path='/bewerten' component={Bewerten} exact />
              <Route path='/favoriten' component={Favoriten} exact />
              <Route path='/login' component={Login} exact />
              <Route path='/logout' component={Logout} exact />
              <Route path='/register' component={Register} exact />
              <Route path='/auth/activate/user/:id' component={UserActivation} exact />
              <Route path='/auth/reset-password' component={ResetPassword} exact />
              <Route path='/auth/reset-password/user/:id' component={SetNewPassword} exact />
              <Route path='/datenschutz' component={Datenschutz} exact />
              <Route path='/ios' component={IosDescription} exact />
              <Route path='/beitragen' component={Beitragen} exact />
              <Route component={NotFound} />
            </IonRouterOutlet>
            <IonTabBar slot='bottom'>
              <IonTabButton tab='home' href='/home'>
                <IonIcon icon={homeOutline} />
                <IonLabel className='labelTabs'>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab='entdecken' href='/entdecken'>
                <IonIcon icon={mapOutline} />
                <IonLabel className='labelTabs'>Entdecken</IonLabel>
              </IonTabButton>
              <IonTabButton tab='bewerten' href='/bewerten'>
                <IonIcon icon={starHalfOutline} />
                <IonLabel className='labelTabs'>Bewerten</IonLabel>
              </IonTabButton>
              <IonTabButton tab='favoriten' href='/favoriten'>
                <IonIcon icon={flagOutline} />
                <IonLabel className='labelTabs'>Favoriten</IonLabel>
                {user && (
                  <IonBadge color='secondary'>{user.favorite_locations.length || 0}</IonBadge>
                )}
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonContent>
      </Suspense>
    </IonApp>
  );
};

export default App;

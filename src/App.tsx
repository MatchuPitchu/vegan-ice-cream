// Redux Store
import { useAppSelector } from './store/hooks';
import { useGetAdditionalInfosFromUserQuery } from './store/api/user-api-slice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Redirect, Route } from 'react-router-dom';
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
import { bookmarks, disc, home, iceCream } from 'ionicons/icons';
import HeaderApp from './components/HeaderApp';
import Home from './pages/Home';
import Entdecken from './pages/Entdecken';
import Bewerten from './pages/Bewerten';
import Preis from './pages/Preis';
import Favoriten from './pages/Favoriten';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ActivateUser from './components/Auth/ActivateUser';
import Logout from './components/Auth/Logout';
import IosDescription from './components/IosDescription';
import ResetPassword from './components/Auth/ResetPassword';
import SetNewPassword from './components/Auth/SetNewPassword';
import Datenschutz from './pages/Datenschutz';

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

const App: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);

  // GET Request: Additional User Informationen
  const {
    data: additionUserData,
    error: errorRTKQuery2,
    isLoading: isLoading2,
  } = useGetAdditionalInfosFromUserQuery(user?._id ?? skipToken); // when `id` is nullish (null/undefined), query is skipped: https://redux-toolkit.js.org/rtk-query/usage-with-typescript#skipping-queries-with-typescript-using-skiptoken

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

      <IonContent>
        <IonTabs>
          <IonRouterOutlet>
            <Redirect from='/' to='/home' exact />
            <Route path='/home' component={Home} exact />
            <Route path='/entdecken' component={Entdecken} exact />
            <Route path='/bewerten' component={Bewerten} exact />
            <Route path='/preis' component={Preis} exact />
            <Route path='/favoriten' component={Favoriten} exact />
            <Route path='/login' component={Login} exact />
            <Route path='/register' component={Register} exact />
            <Route path='/logout' component={Logout} exact />
            <Route path='/auth/activate/user/:id' component={ActivateUser} exact />
            <Route path='/auth/reset-password' component={ResetPassword} exact />
            <Route path='/auth/reset-password/user/:id' component={SetNewPassword} exact />
            <Route path='/datenschutz' component={Datenschutz} exact />
            <Route path='/ios' component={IosDescription} exact />
          </IonRouterOutlet>
          <IonTabBar slot='bottom'>
            <IonTabButton tab='home' href='/home'>
              <IonIcon icon={home} />
              <IonLabel className='labelTabs'>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab='entdecken' href='/entdecken'>
              <IonIcon icon={disc} />
              <IonLabel className='labelTabs'>Entdecken</IonLabel>
            </IonTabButton>
            <IonTabButton tab='bewerten' href='/bewerten'>
              <IonIcon icon={iceCream} />
              <IonLabel className='labelTabs'>Bewerten</IonLabel>
            </IonTabButton>
            <IonTabButton tab='favoriten' href='/favoriten'>
              <IonIcon icon={bookmarks} />
              <IonLabel className='labelTabs'>Favoriten</IonLabel>
              {user && <IonBadge color='secondary'>{user.favorite_locations.length || 0}</IonBadge>}
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonContent>
    </IonApp>
  );
};

export default App;

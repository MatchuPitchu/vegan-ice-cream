import React from 'react';
import ReactDOM from 'react-dom';
import ThemeContextProvider from './context/ThemeContext';
import { NotificationProvider } from './context/ToastContext';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';
import { IonReactRouter } from '@ionic/react-router';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import App from './App';

import { authApi } from './store/api/auth-api-slice';
import { locationsApi } from './store/api/locations-api-slice';

// trigger verifyUserSession and getLocations when App is started
store.dispatch(authApi.endpoints.verifyUserSession.initiate());
store.dispatch(locationsApi.endpoints.getLocations.initiate());
store.dispatch(locationsApi.endpoints.getAllCitiesWithLocations.initiate());

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ThemeContextProvider>
        <NotificationProvider>
          <IonReactRouter>
            <App />
            {/* <ServiceWorkerWrapper /> */}
          </IonReactRouter>
        </NotificationProvider>
      </ThemeContextProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// => moved to ServiceWorker component like described here: https://felixgerschau.com/create-a-pwa-update-notification-with-create-react-app/
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorker.register();

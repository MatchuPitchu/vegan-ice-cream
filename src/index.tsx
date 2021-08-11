import React from 'react';
import ReactDOM from 'react-dom';
import Context from './context/Context';
import App from './App';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import { IonReactRouter } from '@ionic/react-router';

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <IonReactRouter>
        <App />
        <ServiceWorkerWrapper />
      </IonReactRouter>
    </Context>
  </React.StrictMode>,
  document.getElementById('root')
);

// => moved to ServiceWorker component like described here: https://felixgerschau.com/create-a-pwa-update-notification-with-create-react-app/
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorker.register();
import { useState, useEffect } from 'react';
import { IonToast } from '@ionic/react';
import * as serviceWorker from '../serviceWorker';

const ServiceWorkerWrapper = () => {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  const onSWUpdate = (registration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload(true);
  };

  return (
    <IonToast
      isOpen={showReload}
      message="Neue Version verfügbar!"
      position="bottom"
      cssClass="toastOpen"
      buttons={[
        {
          side: 'end',
          text: 'Klick für Update',
          handler: () => {
            reloadPage()
          }
        }
      ]}
    />
  );
}

export default ServiceWorkerWrapper;
import { useState, useEffect } from 'react';
import { IonToast } from '@ionic/react';
import { register } from '../serviceWorker';

const ServiceWorkerWrapper = () => {
  const [showReload, setShowReload] = useState(false);
  const [installingWorker, setInstallingWorker] = useState(null);

  const onSWUpdate = (registration) => {
    setShowReload(true);
    setInstallingWorker(registration.installing);
  };

  useEffect(() => {
    register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    installingWorker.postMessage({ type: 'SKIP_WAITING' });
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
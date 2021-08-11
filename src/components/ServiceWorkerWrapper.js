import { useState, useEffect } from 'react';
import { IonToast } from '@ionic/react';
import { register } from '../serviceWorker';

const ServiceWorkerWrapper = () => {
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    register({ onUpdate: (registration) => {
      if (registration && registration.waiting) setShowReload(true)
        else setShowReload(false)
      }
    });
  }, []);

  const refreshForUpdate = () => {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then(reg => {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        })
        .catch(err => console.log('Could not get registration: ', err));
        
        setShowReload(false);
    }
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
            refreshForUpdate()
          }
        }
      ]}
    />
  );
}

export default ServiceWorkerWrapper;
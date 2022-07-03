import { VFC } from 'react';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  isPlatform,
} from '@ionic/react';
import { logoApple, shareOutline } from 'ionicons/icons';

const IosDescription: VFC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonCard className={`${isPlatform('desktop') ? 'card--ionic' : ''}`}>
          <IonItem lines='none'>
            <IonIcon icon={logoApple} slot='start' />
            <IonLabel className='ion-text-wrap'>Installation der App auf iOS-Geräten</IonLabel>
          </IonItem>
          <IonCardContent>
            <IonText color='primary'>
              <p className='mb-2'>
                Die App ist aus Kostengründen (noch) nicht im Apple App Store erhältlich. Solange
                kannst du die App <strong>als Quasi-App (sog. PWA) auf deinem iPhone</strong>{' '}
                installieren
              </p>
              <ol>
                <li>
                  Öffne im Safari{' '}
                  <b>
                    <a
                      href='https://eis-mit-stil.netlify.app'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      https://eis-mit-stil.netlify.app
                    </a>
                  </b>
                </li>
                <li>
                  Klicke unten in der Mitte den Share-Button des Browsers{' '}
                  <IonIcon size='small' icon={shareOutline} />
                </li>
                <li>Scrolle herunter und klicke auf „Zum Home-Bildschirm“</li>
                <li>Bestätigen und voilà - fertig!</li>
                <li>
                  App auf deinem Home-Bildschirm ab und zu mal ganz schließen und neu starten, damit
                  du kein Update verpasst
                </li>
              </ol>
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default IosDescription;

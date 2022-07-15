import { VFC } from 'react';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  isPlatform,
} from '@ionic/react';
import { giftOutline, logoPaypal } from 'ionicons/icons';
import PageWrapper from '../components/PageUtils/PageWrapper';

const Beitragen: VFC = () => {
  return (
    <PageWrapper showIonHeader={false}>
      <IonCard className={`${isPlatform('desktop') ? 'card--ionic' : ''}`}>
        <IonItem lines='none'>
          <IonIcon icon={giftOutline} slot='start' />
          <IonLabel className='ion-text-wrap'>Gefällt dir die App?</IonLabel>
        </IonItem>
        <IonCardContent>
          <IonText color='primary'>
            <ol>
              <li>Teile die App mit Freund:innen.</li>
              <li>
                Bezahle mir im übertragenen Sinne ein veganes Eis per Paypal! Ich bin dankbar für
                jede Unterstützung, um die Betriebskosten decken und die App weiterentwickeln zu
                können.
              </li>
            </ol>
            <div className='link--centered'>
              <a href='https://paypal.me/eismitstil' target='_blank' rel='noopener noreferrer'>
                <IonIcon size='large' icon={logoPaypal} />
              </a>
            </div>
          </IonText>
        </IonCardContent>
      </IonCard>
    </PageWrapper>
  );
};

export default Beitragen;

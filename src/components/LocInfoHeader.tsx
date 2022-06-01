import { useContext, VFC } from 'react';
import { Context } from '../context/Context';
import type { IceCreamLocation } from '../types';
import { IonAvatar, IonItem, IonLabel } from '@ionic/react';
import ButtonFavoriteLocation from './Comments/ButtonFavoriteLocation';

interface Props {
  location: IceCreamLocation;
}

const LocInfoHeader: VFC<Props> = ({ location }) => {
  const { user } = useContext(Context);

  return (
    <IonItem lines='full'>
      <IonAvatar slot='start'>
        <img src='./assets/icons/ice-cream-icon-dark.svg' alt='' />
      </IonAvatar>
      <IonLabel className='ion-text-wrap'>
        <p style={{ color: 'var(--ion-text-color)' }}>{location.name}</p>
        <p>
          {location?.address?.street} {location?.address?.number}
        </p>
        <p className='mb-1'>
          {location?.address?.zipcode} {location?.address?.city}
        </p>
        {location?.location_url && (
          <p>
            <a
              className='websiteLink'
              href={
                location.location_url.includes('http')
                  ? location.location_url
                  : `//${location.location_url}`
              }
              target='_blank'
              rel='noopener noreferrer'
            >
              {location.location_url}
            </a>
          </p>
        )}
      </IonLabel>
      {user && location && <ButtonFavoriteLocation selectedLocation={location} />}
    </IonItem>
  );
};

export default LocInfoHeader;

import { VFC } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { IceCreamLocation } from '../../types/types';
import { IonAvatar, IonItem, IonLabel } from '@ionic/react';
import ButtonFavoriteLocation from '../Comments/ButtonFavoriteLocation';

interface Props {
  location: IceCreamLocation;
}

const CardContent: VFC<Props> = ({ location }) => {
  const { user } = useAppSelector((state) => state.user);

  if (!location) return null;

  const href = location?.location_url.includes('http')
    ? location?.location_url
    : `//${location?.location_url}`;

  return (
    <IonItem lines='none'>
      <IonAvatar slot='start' className='card__icon-avatar'>
        <img src='./assets/icons/ice-cream-icon-dark.svg' alt='Logo Eis mit Stil' />
      </IonAvatar>
      <IonLabel className='ion-text-wrap'>
        <div className='card-content__title'>{location.name}</div>
        <div className='card-content__address'>
          {location?.address?.street} {location?.address?.number}
        </div>
        <div className='card-content__address'>
          {location?.address?.zipcode} {location?.address?.city}
        </div>
        {location?.location_url && (
          <a className='link--website' href={href} target='_blank' rel='noopener noreferrer'>
            {location?.location_url}
          </a>
        )}
      </IonLabel>
      {user && <ButtonFavoriteLocation location={location} />}
    </IonItem>
  );
};

export default CardContent;

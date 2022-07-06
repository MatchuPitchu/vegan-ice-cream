import { VFC } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { IceCreamLocation } from '../../types/types';
import { IonAvatar, IonItem, IonLabel } from '@ionic/react';
import ButtonFavoriteLocation from '../Comments/ButtonFavoriteLocation';
import AddressBlock from './AddressBlock';
import WebsiteBlock from './WebsiteBlock';

interface Props {
  location: IceCreamLocation;
  showAvatar?: boolean;
}

const CardContent: VFC<Props> = ({ location, showAvatar = true }) => {
  const { user } = useAppSelector((state) => state.user);

  if (!location) return null;

  return (
    <IonItem lines='none'>
      {showAvatar && (
        <IonAvatar slot='start' className='card__icon-avatar'>
          <img src='./assets/icons/ice-cream-icon-dark.svg' alt='Logo Eis mit Stil' />
        </IonAvatar>
      )}
      <IonLabel className='ion-text-wrap'>
        <div className='card-content__title'>{location.name}</div>
        {location?.address && <AddressBlock address={location.address} />}
        {location?.location_url && <WebsiteBlock url={location.location_url} />}
      </IonLabel>
      {user && <ButtonFavoriteLocation location={location} />}
    </IonItem>
  );
};

export default CardContent;

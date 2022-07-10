import { useState } from 'react';
// Redux Store
import { useAppDispatch } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
import { SortType } from '../store/locationsSlice';
// Context
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
  IonRadioGroup,
  IonRadio,
} from '@ionic/react';
import { caretDownCircleOutline, caretForwardCircleOutline } from 'ionicons/icons';

// TODO: Filter CITY + STORE entfernen oder neu konzipieren

const ListFilters = () => {
  const dispatch = useAppDispatch();
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<SortType>();

  const handleSortLocationsList = ({ detail: { value } }: { detail: { value: SortType } }) => {
    setSelected(value);
    switch (value) {
      case SortType.VEGAN_OFFER:
        dispatch(locationsActions.sortLocationsVeganOffer('desc'));
        break;
      case SortType.QUALITY:
        dispatch(locationsActions.sortLocationsQuality('desc'));
        break;
      default:
        return;
    }
  };

  return (
    <div className='filter'>
      <div className='filter__title item--small' onClick={() => setShowFilter((prev) => !prev)}>
        <div>Sortieren</div>
        <IonIcon
          size='small'
          icon={!showFilter ? caretForwardCircleOutline : caretDownCircleOutline}
        />
      </div>

      {showFilter && (
        <IonList className='filter__item'>
          <IonRadioGroup value={selected} onIonChange={handleSortLocationsList}>
            <IonItem className='filter__label item--small' lines='inset'>
              <IonLabel>Veganes Angebot (★ &rarr; ☆)</IonLabel>
              <IonRadio mode='ios' slot='end' value={SortType.VEGAN_OFFER} />
            </IonItem>

            <IonItem className='filter__label item--small' lines='none'>
              <IonLabel>Eis-Erlebnis (★ &rarr; ☆)</IonLabel>
              <IonRadio mode='ios' slot='end' value={SortType.QUALITY} />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      )}
    </div>
  );
};

export default ListFilters;

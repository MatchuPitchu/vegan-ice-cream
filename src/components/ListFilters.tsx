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
  isPlatform,
  IonRadioGroup,
  IonRadio,
} from '@ionic/react';
import { caretDownCircle, caretForwardCircle } from 'ionicons/icons';

const ListFilters = () => {
  const dispatch = useAppDispatch();
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<SortType>();

  const handleSortLocationsList = ({ detail: { value } }: { detail: { value: SortType } }) => {
    setSelected(value);
    switch (value) {
      case SortType.VEGAN_OFFER:
        dispatch(locationsActions.sortLocationsListVeganOffer('desc'));
        break;
      case SortType.QUALITY:
        dispatch(locationsActions.sortLocationsListQuality('desc'));
        break;
      case SortType.CITY:
        dispatch(locationsActions.sortLocationsListCity('asc'));
        break;
      case SortType.STORE:
        dispatch(locationsActions.sortLocationsListStore('asc'));
        break;
      default:
        return;
    }
  };

  return (
    <IonCard className={`${isPlatform('desktop') ? 'cardIonic' : ''}`}>
      <IonItem
        className='itemTextSmall'
        lines={!showFilter ? 'none' : 'full'}
        detail={false}
        button
        onClick={() => setShowFilter((prev) => !prev)}
      >
        <IonLabel>Sortieren</IonLabel>
        <IonIcon size='small' icon={!showFilter ? caretForwardCircle : caretDownCircle} />
      </IonItem>

      {showFilter && (
        <IonList className='filterContainer'>
          <IonRadioGroup value={selected} onIonChange={handleSortLocationsList}>
            <IonItem className='labelFilter' lines='none'>
              <IonLabel>Veganes Angebot (★ &rarr; ☆)</IonLabel>
              <IonRadio slot='end' value={SortType.VEGAN_OFFER} />
            </IonItem>

            <IonItem className='labelFilter' lines='none'>
              <IonLabel>Eis-Erlebnis (★ &rarr; ☆)</IonLabel>
              <IonRadio slot='end' value={SortType.QUALITY} />
            </IonItem>

            <IonItem className='labelFilter' lines='none'>
              <IonLabel>Stadt (A &rarr; Z)</IonLabel>
              <IonRadio slot='end' value={SortType.CITY} />
            </IonItem>

            <IonItem className='labelFilter' lines='none'>
              <IonLabel>Eisladen (A &rarr; Z)</IonLabel>
              <IonRadio slot='end' value={SortType.STORE} />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      )}
    </IonCard>
  );
};

export default ListFilters;

import { useState } from 'react';
// Redux Store
import { useAppDispatch } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
import { SortType } from '../store/locationsSlice';
// Context
import { IonList, IonItem, IonLabel, IonIcon, IonRadioGroup, IonRadio } from '@ionic/react';
import { caretForwardCircleOutline } from 'ionicons/icons';

const ListFilter = () => {
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
          className={showFilter ? 'icon--rotate90Forward' : 'icon--rotateBack'}
          icon={caretForwardCircleOutline}
        />
      </div>

      {showFilter && (
        <IonList className='filter__list filter--background-transparent'>
          <IonRadioGroup
            className='filter--background-transparent'
            value={selected}
            onIonChange={handleSortLocationsList}
          >
            <IonItem
              className='filter__item item--small filter--background-transparent'
              lines='inset'
            >
              <IonLabel>Veganes Angebot (★ &rarr; ☆)</IonLabel>
              <IonRadio mode='ios' slot='end' value={SortType.VEGAN_OFFER} />
            </IonItem>

            <IonItem
              className='filter__item item--small filter--background-transparent'
              lines='none'
            >
              <IonLabel>Eis-Erlebnis (★ &rarr; ☆)</IonLabel>
              <IonRadio mode='ios' slot='end' value={SortType.QUALITY} />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      )}
    </div>
  );
};

export default ListFilter;

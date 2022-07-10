import { useState, VFC } from 'react';
import type { Flavor, PopoverState } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { flavorActions } from '../store/flavorSlice';
import { useGetFlavorsQuery } from '../store/api/flavor-api-slice';
import { useAutocomplete } from '../hooks/useAutocomplete';
import Highlighter from 'react-highlight-words';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonSearchbar,
} from '@ionic/react';
import { informationCircle, pencil, trash } from 'ionicons/icons';

// TODO: Predictions mit Keyboard durchgehen
const SearchFlavors: VFC = () => {
  const dispatch = useAppDispatch();
  const { flavor, searchTermFlavor } = useAppSelector((state) => state.flavor);

  const [showPopover, setShowPopover] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });

  const { data: flavors, error, isLoading, isSuccess } = useGetFlavorsQuery();

  const { handleSearchTextChange, suggestions, setSuggestions, searchWords } =
    useAutocomplete<Flavor>(flavors ?? []);

  const onSearchTextChanged = (searchText: string) => handleSearchTextChange(searchText, 8);

  // TODO mit Keyboard Auswahl durchgehen und bestätigen
  return (
    <>
      <IonItem lines='none' className='item--small item--card-background'>
        <IonLabel className='mb-1' position='stacked'>
          Name Eissorte
        </IonLabel>
        <IonIcon
          className='info-icon'
          color='primary'
          slot='end'
          icon={informationCircle}
          onClick={(event) => {
            event.persist();
            setShowPopover({ showPopover: true, event });
          }}
        />
      </IonItem>

      <IonItem
        lines={suggestions.length > 0 && searchTermFlavor !== flavor?.name ? 'none' : 'full'}
        className='item--card-background'
      >
        <IonSearchbar
          className='searchbar--flavor'
          type='text'
          inputMode='text'
          placeholder='Welche Eissorte willst du bewerten?'
          showCancelButton='never'
          showClearButton='always'
          clearIcon={trash}
          searchIcon={pencil}
          value={searchTermFlavor}
          debounce={100}
          onIonChange={({ detail: { value } }) => {
            if (flavor) {
              dispatch(flavorActions.resetFlavor());
            }
            dispatch(flavorActions.setSearchTermFlavor(value ?? ''));
            onSearchTextChanged(value ?? '');
          }}
          onIonClear={() => dispatch(flavorActions.resetFlavor())}
          onKeyUp={(e) => e.key === 'Enter' && setSuggestions([])}
        />
      </IonItem>

      {suggestions.length > 0 && searchTermFlavor !== flavor?.name && (
        <IonList className='item--card-background py-0'>
          <div className='info-text item--card-background'>
            ... von anderen Nutzer:innen eingetragen
          </div>
          {suggestions.map((flavor) => (
            <IonItem
              key={flavor._id}
              className='item--card-background'
              lines='full'
              button
              onClick={() => {
                dispatch(flavorActions.setFlavor(flavor));
                setSuggestions([]);
                dispatch(flavorActions.setSearchTermFlavor(flavor.name));
              }}
            >
              <Highlighter
                className='hightlighter-wrapper'
                activeIndex={-1}
                highlightClassName='highlight'
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={`${flavor.name} ${flavor.type_fruit ? '• Sorbet' : ''} ${
                  flavor.type_cream ? '• Cremeeis' : ''
                }`}
              />
              <div
                className='flavor-search-preview'
                style={{
                  background: `linear-gradient(to bottom, ${flavor.color.primary}, ${
                    flavor.color.secondary ? flavor.color.secondary : flavor.color.primary
                  })`,
                }}
              />
            </IonItem>
          ))}
        </IonList>
      )}

      <IonPopover
        cssClass='info-popover'
        animated={true}
        translucent={true}
        event={showPopover.event}
        isOpen={showPopover.showPopover}
        onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
        backdropDismiss={true}
      >
        <IonContent>
          Wähle aus den bereits verfügbaren Eissorten oder tippe einen neuen Namen ein.
        </IonContent>
      </IonPopover>
    </>
  );
};

export default SearchFlavors;

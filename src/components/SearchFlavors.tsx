import { useState, useEffect, VFC } from 'react';
import type { Flavor, PopoverState } from '../types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { flavorActions } from '../store/flavorSlice';
import { appActions } from '../store/appSlice';
import { useAutocomplete } from '../hooks/useAutocomplete';
import Highlighter from 'react-highlight-words';
import { IonIcon, IonItem, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { iceCream, informationCircle } from 'ionicons/icons';
import LoadingError from './LoadingError';

const SearchFlavors: VFC = () => {
  const dispatch = useAppDispatch();
  const { flavor, searchTextFlavor } = useAppSelector((state) => state.flavor);

  const [popoverShow, setPopoverShow] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });
  const [flavors, setFlavors] = useState([]);

  const { handleSearchTextChange, predictions, setPredictions, searchWords } =
    useAutocomplete<Flavor>(flavors);

  useEffect(() => {
    dispatch(appActions.setIsLoading(true));
    const fetchFlavors = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/flavors`);
        const data = await res.json();
        setFlavors(data);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchFlavors();
    dispatch(appActions.setIsLoading(false));
  }, [dispatch]);

  const onSearchTextChanged = (searchText: string) => handleSearchTextChange(searchText, 8);

  return (
    <>
      <div
        className='d-flex align-items-center pt-2'
        style={{ backgroundColor: 'var(--ion-item-background)' }}
      >
        <IonSearchbar
          className='searchbar'
          type='search'
          inputMode='text'
          placeholder='Name Eissorte eintippen'
          showCancelButton='always'
          showClearButton='always'
          searchIcon={iceCream}
          cancel-button-text=''
          spellcheck={true}
          autocorrect='on'
          value={searchTextFlavor}
          debounce={100}
          onIonChange={({ detail: { value } }) => {
            dispatch(flavorActions.setSearchTermFlavor(value ?? ''));
            onSearchTextChanged(value ?? '');
          }}
          onIonCancel={() => dispatch(flavorActions.resetFlavor())}
          onIonClear={() => dispatch(flavorActions.resetFlavor())}
          onKeyUp={(e) => e.key === 'Enter' && setPredictions([])}
        />
        <div>
          <IonIcon
            className='infoIcon me-2'
            color='primary'
            onClick={(e) => {
              e.persist();
              setPopoverShow({ showPopover: true, event: e });
            }}
            icon={informationCircle}
          />
          <IonPopover
            cssClass='info-popover'
            event={popoverShow.event}
            isOpen={popoverShow.showPopover}
            onDidDismiss={() => setPopoverShow({ showPopover: false, event: undefined })}
          >
            Keine passenden Vorschläge? Tippe einfach den Namen der neuen Eissorte ein.
          </IonPopover>
        </div>
      </div>

      {predictions.length && searchTextFlavor !== flavor?.name ? (
        <IonList className='py-0'>
          <div className='infoText pt-2'>... Auswahl bereits eingetragener Sorten</div>
          {predictions.map((flavor) => (
            <IonItem
              key={flavor._id}
              button
              onClick={() => {
                dispatch(flavorActions.setFlavor(flavor));
                setPredictions([]);
                dispatch(flavorActions.setSearchTermFlavor(flavor.name));
              }}
              lines='full'
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
              ></div>
            </IonItem>
          ))}
        </IonList>
      ) : null}
      <LoadingError />
    </>
  );
};

export default SearchFlavors;

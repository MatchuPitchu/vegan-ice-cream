import { useContext, useState } from 'react';
import type { IceCreamLocation, PopoverState } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { locationsActions } from '../store/locationsSlice';
import { searchActions } from '../store/searchSlice';
// Context
import { Context } from '../context/Context';
import Highlighter from 'react-highlight-words';
import { IonIcon, IonItem, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { informationCircle } from 'ionicons/icons';
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables-and-functions';
import { useAutocomplete } from '../hooks/useAutocomplete';

const Search = () => {
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locations);
  const { searchText } = useAppSelector((state) => state.search);
  const { entdeckenSegment } = useAppSelector((state) => state.app);

  const { searchViewport } = useContext(Context);

  const { handleSearchTextChange, predictions, setPredictions, searchWords } =
    useAutocomplete<IceCreamLocation>(locations);

  // const [predictions, setPredictions] = useState<IceCreamLocation[]>([]);
  // const [searchWords, setSearchWords] = useState<string[]>([]);

  const [showPopover, setShowPopover] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (event.target.elements[0].value.length < 3) return;
    if (entdeckenSegment === 'list') return;

    dispatch(appActions.setIsLoading(true));

    try {
      const uri = encodeURI(event.target.elements[0].value);
      const res = await fetch(`${GOOGLE_API_URL}${uri}${GOOGLE_API_URL_CONFIG}`);
      const { results } = await res.json();

      if (results[0].geometry.location) {
        // center + zoom when user submits his search terms (does NOT select from predictions)
        dispatch(
          mapActions.setCenter({
            lat: results[0].geometry.location.lat,
            lng: results[0].geometry.location.lng,
          })
        );
        dispatch(mapActions.setZoom(12));
      }
    } catch (error) {
      dispatch(
        appActions.setError(
          'Ups, schief gelaufen. Nur Orte in Deutschland, Österreich und der Schweiz möglich'
        )
      );
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }

    searchViewport();
    setPredictions([]);
    dispatch(locationsActions.resetLocationsSearchResults());
    dispatch(appActions.setIsLoading(false));

    dispatch(searchActions.setSearchText(''));
  };

  const onSearchTextChanged = (searchText: string) => {
    if (searchText.length < 3) {
      dispatch(locationsActions.resetLocationsSearchResults());
      dispatch(locationsActions.resetSelectedLocation());
      // no return here since execution stops in handleSearchTextChange()
    }

    const filteredLocations = handleSearchTextChange(searchText, 4, entdeckenSegment);

    // if user is on map list page and uses searchbar then filteredLocations is returned from handleSearchTextChange and resultsList is displayed
    if (filteredLocations !== undefined) {
      dispatch(locationsActions.setLocationsSearchResults(filteredLocations));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='d-flex align-items-center'>
        <IonSearchbar
          className='searchbar'
          type='search'
          inputMode='search'
          placeholder='Eisladen oder Stadt suchen'
          showCancelButton='always'
          showClearButton='always'
          cancel-button-text=''
          value={searchText}
          debounce={500}
          onIonChange={({ detail: { value } }) => {
            dispatch(searchActions.setSearchText(value ?? ''));
            onSearchTextChanged(value ?? '');
          }}
        />
        <div>
          <IonIcon
            className='infoIcon me-2'
            color='primary'
            onClick={(e) => {
              e.persist();
              setShowPopover({ showPopover: true, event: e });
            }}
            icon={informationCircle}
          />
          <IonPopover
            cssClass='info-popover'
            animated={true}
            event={showPopover.event}
            isOpen={showPopover.showPopover}
            onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
            backdropDismiss={true}
            translucent={true}
          >
            Nichts gefunden? Trage den Eisladen auf der Karte ein.
          </IonPopover>
        </div>
      </div>
      {predictions && entdeckenSegment === 'map' && (
        <IonList className='py-0'>
          {predictions.map((location) => (
            <IonItem
              key={location._id}
              button
              onClick={() => {
                dispatch(
                  searchActions.setSearchText(
                    `${location.name}, ${location.address.street} ${location.address.number}, ${location.address.city}`
                  )
                );
                dispatch(locationsActions.setSelectedLocation(location._id));
                setPredictions([]);
              }}
              lines='full'
            >
              <Highlighter
                className='hightlighter-wrapper'
                activeIndex={-1}
                highlightClassName='highlight'
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={`${location.name}, ${location.address.street} ${location.address.number} in ${location.address.city}`}
              />
            </IonItem>
          ))}
        </IonList>
      )}
    </form>
  );
};

export default Search;
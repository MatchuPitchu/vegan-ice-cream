import { FormEvent, useContext, useState } from 'react';
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
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables';
import type { IceCreamLocation } from '../types';
import { selectedLocationActions } from '../store/selectedLocationSlice';

interface PopoverState {
  showPopover: boolean;
  event: any | undefined;
}

const Search = () => {
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locations);
  const { searchText } = useAppSelector((state) => state.search);
  const { entdeckenSegment } = useAppSelector((state) => state.app);

  const { searchViewport } = useContext(Context);

  const [predictions, setPredictions] = useState<IceCreamLocation[]>([]);
  const [showPopover, setShowPopover] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });
  const [searchWords, setSearchWords] = useState<string[]>([]);

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

  const handleSearchTextChange = (value: string) => {
    if (!locations) return;
    if (value.length < 3) {
      setPredictions([]);
      dispatch(locationsActions.resetLocationsSearchResults());
      dispatch(selectedLocationActions.resetSelectedLocation());
      return;
    }

    const searchTerms = value.split(/\s/).filter(Boolean); // create array of search terms, remove all whitespaces
    const filteredLocations = locations.filter((location) => {
      const text =
        `${location.name} ${location.address.street} ${location.address.number} ${location.address.zipcode} ${location.address.city}`.toLowerCase();
      return searchTerms.every((searchTerm) => text.includes(searchTerm.toLowerCase()));
    });
    // if user is on map list page and uses searchbar then resultsList is displayed
    if (entdeckenSegment === 'list') {
      dispatch(locationsActions.setLocationsSearchResults(filteredLocations));
    }
    if (entdeckenSegment === 'map') {
      setPredictions(filteredLocations.slice(0, 4));
    }
    setSearchWords(searchTerms);
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
            handleSearchTextChange(value ?? '');
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
                dispatch(selectedLocationActions.setSelectedLocation(location));
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

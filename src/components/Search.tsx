import { VFC } from 'react';
import type { IceCreamLocation } from '../types/types';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables-and-functions';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { locationsActions } from '../store/locationsSlice';
import Highlighter from 'react-highlight-words';
import { IonItem, IonSearchbar } from '@ionic/react';
import { searchCircleOutline, trash } from 'ionicons/icons';
import { searchActions } from '../store/searchSlice';

type Props = {
  showSuggestions?: boolean;
};

const Search: VFC<Props> = ({ showSuggestions = true }) => {
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locations);

  const {
    handleSearchTextChange,
    suggestions,
    searchWordsArray,
    searchText,
    resetSearch,
    selectSearchItem,
  } = useAutocomplete<IceCreamLocation>(locations);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (event.target.elements[0].value.length < 3) return;

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

    dispatch(locationsActions.resetLocationsSearchResults());
    resetSearch();
    dispatch(appActions.setIsLoading(false));
  };

  const onSearchTextChanged = (searchInput: string) => {
    handleSearchTextChange(searchInput, 5);

    if (searchInput.length < 3) {
      dispatch(locationsActions.resetLocationsSearchResults());
      dispatch(locationsActions.resetSelectedLocation());
      dispatch(searchActions.setSearchResultState({ searchInput: '', resultsLength: 0 }));
    }
  };

  // TODO: 0) Search and SearchFlavors vereinheitlichen
  // TODO: 1) Styling wie searchbar flavor oder anders (nutze das auch bei Entdecken)
  // TODO: 2) React Hook Form implementieren
  // TODO: 3) Bootstrap rausschmeißen

  return (
    <form onSubmit={onSubmit}>
      <IonSearchbar
        className='searchbar--flavor'
        type='search'
        inputMode='search'
        placeholder='Eisladen oder Stadt suchen'
        showCancelButton='never'
        showClearButton='always'
        clearIcon={trash}
        searchIcon={searchCircleOutline}
        value={searchText}
        debounce={100}
        onIonChange={({ detail: { value } }) => onSearchTextChanged(value ?? '')}
        onIonClear={() => resetSearch()}
      />

      {suggestions && showSuggestions && (
        <div>
          {suggestions.map((location) => (
            <IonItem
              className='item--item-background item--smallest'
              key={location._id}
              button
              onClick={() => {
                selectSearchItem(
                  `${location.name}, ${location.address.street} ${location.address.number}, ${location.address.city}`
                );
                dispatch(locationsActions.setSelectedLocation(location._id));
              }}
              lines='full'
            >
              <Highlighter
                className='highlighter-wrapper'
                activeIndex={-1}
                highlightClassName='highlighter-wrapper__highlight'
                searchWords={searchWordsArray}
                caseSensitive={false}
                textToHighlight={`${location.name}, ${location.address.street} ${location.address.number}, ${location.address.city}`}
              />
            </IonItem>
          ))}
        </div>
      )}
    </form>
  );
};

export default Search;

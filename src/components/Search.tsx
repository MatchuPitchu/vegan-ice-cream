import { VFC } from 'react';
import type { IceCreamLocation } from '../types/types';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables-and-functions';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { locationsActions } from '../store/locationsSlice';
import { searchActions } from '../store/searchSlice';
import Highlighter from 'react-highlight-words';
import { IonItem, IonList, IonSearchbar } from '@ionic/react';
import { searchCircleOutline, trash } from 'ionicons/icons';

type Props = {
  cancelSubmit?: boolean;
  showSuggestions?: boolean;
};

const Search: VFC<Props> = ({ cancelSubmit = false, showSuggestions = true }) => {
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locations);
  const { searchText } = useAppSelector((state) => state.search);

  const { handleSearchTextChange, suggestions, setSuggestions, searchWords } =
    useAutocomplete<IceCreamLocation>(locations);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (cancelSubmit) return;
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

    setSuggestions([]);
    dispatch(locationsActions.resetLocationsSearchResults());
    dispatch(appActions.setIsLoading(false));

    dispatch(searchActions.setSearchText(''));
  };

  const onSearchTextChanged = (searchText: string) => {
    if (searchText.length < 3) {
      dispatch(locationsActions.resetLocationsSearchResults());
      dispatch(locationsActions.resetSelectedLocation());
      return;
    }

    handleSearchTextChange(searchText, 4);
  };

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
        debounce={500}
        onIonChange={({ detail: { value } }) => {
          dispatch(searchActions.setSearchText(value ?? ''));
          onSearchTextChanged(value ?? '');
        }}
      />

      {suggestions && showSuggestions && (
        <IonList className='py-0'>
          {suggestions.map((location) => (
            <IonItem
              className='item--small item--card-background'
              key={location._id}
              button
              onClick={() => {
                dispatch(
                  searchActions.setSearchText(
                    `${location.name}, ${location.address.street} ${location.address.number}, ${location.address.city}`
                  )
                );
                dispatch(locationsActions.setSelectedLocation(location._id));
                setSuggestions([]);
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

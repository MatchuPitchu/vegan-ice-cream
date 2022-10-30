import { VFC } from 'react';
import type { IceCreamLocation } from '../../types/types';
import { useAutocomplete } from '../../hooks/useAutocomplete';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { locationsActions } from '../../store/locationsSlice';
import { IonSearchbar } from '@ionic/react';
import { searchCircleOutline, trash } from 'ionicons/icons';

const Search: VFC = () => {
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locations);

  const { handleSearchTextChange, searchText, resetSearch } = useAutocomplete<IceCreamLocation>(locations);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    onSearchTextChanged(searchText);
  };

  const onSearchTextChanged = (searchInput: string) => {
    handleSearchTextChange(searchInput, 5);

    if (searchInput.length < 3) {
      dispatch(locationsActions.resetLocationsSearchResults());
      resetSearch('home');
    }
  };

  // TODO: 0) SearchHome, SearchMap, Search Location Bewerten Form and SearchFlavors vereinheitlichen
  // TODO: 1) Styling wie searchbar flavor oder anders (nutze das auch bei Entdecken)
  // TODO: 2) Bootstrap rausschmeißen

  return (
    <form onSubmit={onSubmit}>
      <IonSearchbar
        className='searchbar--customize'
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
      />
    </form>
  );
};

export default Search;

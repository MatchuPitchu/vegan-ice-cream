import { useState } from 'react';
import type { Flavor, IceCreamLocation } from '../types/types';
import { isFlavor, isIceCreamLocation, isString } from '../types/typeguards';
import { useAppDispatch } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
import { searchActions } from '../store/searchSlice';

// TODO: add onKeyDown functionality + merge with useAutocompleteWithReducer
export const useAutocomplete = <T extends Flavor | IceCreamLocation | string>(
  searchableArray: T[]
) => {
  const dispatch = useAppDispatch();

  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [searchWordsArray, setSearchWords] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredSearchResult, setfilteredSearchResult] = useState<T[]>([]);

  const handleSearchTextChange = (searchInput: string, numberOfItemsInFilterResult: number) => {
    setSearchText(searchInput);

    if (!searchableArray) return;
    if (searchInput.length < 3) {
      setSuggestions([]);
      return;
    }

    const searchTerms = searchInput.split(/\s/).filter(Boolean); // create array of search terms, remove all whitespaces
    const filteredSearchableArray = searchableArray.filter((item) => {
      let text = '';
      if (isIceCreamLocation(item)) {
        text = `${item.name} ${item.address.street} ${item.address.number} ${item.address.zipcode} ${item.address.city}`;
      }

      if (isFlavor(item)) {
        text = item.name;
      }

      if (isString(item)) {
        text = item;
      }

      return searchTerms.every((searchTerm) =>
        text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setfilteredSearchResult(filteredSearchableArray);

    if (filteredSearchableArray[0] && isIceCreamLocation(filteredSearchableArray[0])) {
      dispatch(
        locationsActions.setLocationsSearchResults(filteredSearchableArray as IceCreamLocation[])
      );
    }

    dispatch(
      searchActions.setSearchResultState({
        searchInput,
        resultsLength: filteredSearchableArray.length,
      })
    );

    setSuggestions(filteredSearchableArray.slice(0, numberOfItemsInFilterResult));
    setSearchWords(searchTerms);
  };

  const resetSearch = () => {
    setSearchText('');
    setSuggestions([]);
    dispatch(
      searchActions.setSearchResultState({
        searchInput: '',
        resultsLength: 0,
      })
    );
  };

  const selectSearchItem = (value: string) => {
    setSearchText(value);
    setSuggestions([]);
  };

  return {
    handleSearchTextChange,
    suggestions,
    searchWordsArray,
    searchText,
    resetSearch,
    filteredSearchResult,
    selectSearchItem,
  };
};

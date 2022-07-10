import { useState } from 'react';
import type { Flavor, IceCreamLocation } from '../types/types';
import { useAppDispatch } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';

const isIceCreamLocation = (
  searchableItem: Flavor | IceCreamLocation | string
): searchableItem is IceCreamLocation => {
  return (searchableItem as IceCreamLocation).address !== undefined;
};

const isFlavor = (searchableItem: Flavor | IceCreamLocation | string): searchableItem is Flavor => {
  return (searchableItem as Flavor).color !== undefined;
};

const isString = (searchableItem: Flavor | IceCreamLocation | string): searchableItem is string => {
  return typeof (searchableItem as string) === 'string';
};

// TODO: add onKeyDown functionality + merge with useAutocompleteWithReducer
export const useAutocomplete = <T extends Flavor | IceCreamLocation | string>(
  searchableArray: T[]
) => {
  const dispatch = useAppDispatch();

  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [searchWords, setSearchWords] = useState<string[]>([]);
  const [filteredSearchResult, setfilteredSearchResult] = useState<T[]>([]);

  const handleSearchTextChange = (value: string, numberOfItemsInFilterResult: number) => {
    if (!searchableArray) return;
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const searchTerms = value.split(/\s/).filter(Boolean); // create array of search terms, remove all whitespaces
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

    if (isIceCreamLocation(filteredSearchableArray[0])) {
      dispatch(
        locationsActions.setLocationsSearchResults(filteredSearchableArray as IceCreamLocation[])
      );
    }

    setSuggestions(filteredSearchableArray.slice(0, numberOfItemsInFilterResult));
    setSearchWords(searchTerms);
  };

  return {
    handleSearchTextChange,
    suggestions,
    setSuggestions,
    searchWords,
    filteredSearchResult,
  };
};

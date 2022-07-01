import { useState } from 'react';
import type { EntdeckenSegment } from '../store/appSlice';
import { Flavor, IceCreamLocation } from '../types/types';

// TODO: add onKeyDown functionality + merge with useAutocompleteWithReducer
export const useAutocomplete = <T extends Flavor | IceCreamLocation | string>(
  searchableArray: T[]
) => {
  const [predictions, setPredictions] = useState<T[]>([]);
  const [searchWords, setSearchWords] = useState<string[]>([]);

  const handleSearchTextChange = (
    value: string,
    numberOfItemsInFilterResult: number,
    entdeckenSegment?: EntdeckenSegment
  ) => {
    if (!searchableArray) return;
    if (value.length < 3) {
      setPredictions([]);
      return;
    }

    const isIceCreamLocation = (
      searchableItem: Flavor | IceCreamLocation | string
    ): searchableItem is IceCreamLocation => {
      return (searchableItem as IceCreamLocation).address !== undefined;
    };
    const isFlavor = (
      searchableItem: Flavor | IceCreamLocation | string
    ): searchableItem is Flavor => {
      return (searchableItem as Flavor).color !== undefined;
    };
    const isString = (
      searchableItem: Flavor | IceCreamLocation | string
    ): searchableItem is string => {
      return typeof (searchableItem as string) === 'string';
    };

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
    // if user is on map list page and uses searchbar then resultsList is displayed
    if (entdeckenSegment === 'list') {
      return filteredSearchableArray;
    }
    setPredictions(filteredSearchableArray.slice(0, numberOfItemsInFilterResult));
    setSearchWords(searchTerms);
  };

  return {
    handleSearchTextChange,
    predictions,
    setPredictions,
    searchWords,
  };
};

import { useReducer } from 'react';

type AutocompleteState = {
  value: string;
  suggestions: { itemValue: string; restPart: string }[];
  currentFocus: number | null; // apart from null and -1 (input field), currentFocus holds index of active suggestion
};

enum ActionTypes {
  INPUT_CHANGED = 'INPUT_CHANGED',
  ARROW_DOWN = 'ARROW_DOWN',
  ARROW_UP = 'ARROW_UP',
  SELECTED = 'SELECTED',
}

type Action = {
  type: ActionTypes;
  value?: string;
  items?: string[];
};

const initialState: AutocompleteState = {
  value: '',
  suggestions: [],
  currentFocus: null,
};

const defaultFilter = (inputValue: string, items: string[]) => {
  if (inputValue === '') return [];

  // 1) if input matches beginning of item, keep it
  const filterItems = items.filter((item) => {
    const matchString = item.slice(0, inputValue.length);
    const found = matchString.toLowerCase().match(inputValue.toLowerCase());
    return found;
  });
  // 2) define restPart string (-> without input)
  const highlightingData = filterItems.map((item) => ({
    itemValue: item,
    restPart: item.slice(inputValue.length),
  }));

  const suggestions = highlightingData.slice(0, 100); // limits suggestions to x items
  return suggestions;
};

const reducerFn = (prev: AutocompleteState, { type, value, items }: Action) => {
  switch (type) {
    case ActionTypes.INPUT_CHANGED:
      if (value && items) {
        return {
          value,
          suggestions: defaultFilter(value, items),
          currentFocus: -1, // focus is on search input at start
        };
      }
      break;
    case ActionTypes.ARROW_DOWN:
      return {
        value: prev.value,
        suggestions: prev.suggestions,
        // if active is at bottom, jump to start, otherwise move to next item
        currentFocus:
          prev.currentFocus === prev.suggestions.length - 1 ? 0 : prev.currentFocus! + 1,
      };
    case ActionTypes.ARROW_UP:
      return {
        value: prev.value,
        suggestions: prev.suggestions,
        // if active is at top, jump to last, otherwise move to previous item
        currentFocus:
          prev.currentFocus === 0 || prev.currentFocus === -1
            ? prev.suggestions.length - 1
            : prev.currentFocus! - 1,
      };
    case ActionTypes.SELECTED:
      if (value) {
        return {
          value,
          // reset initial values
          suggestions: [],
          currentFocus: null,
        };
      }
      break;
  }
  return initialState;
};

export const useAutocompleteWithReducer = () => {
  const [{ value, suggestions, currentFocus }, dispatchFn] = useReducer(reducerFn, initialState);

  const handleInputChange = (items: string[], newInput: string) => {
    dispatchFn({ type: ActionTypes.INPUT_CHANGED, value: newInput, items });
  };

  const handleSelect = (value: string) => dispatchFn({ type: ActionTypes.SELECTED, value });

  const handleKeyDown = ({ key }: { key: string }) => {
    switch (key) {
      case 'ArrowDown':
        dispatchFn({ type: ActionTypes.ARROW_DOWN });
        break;
      case 'ArrowUp':
        dispatchFn({ type: ActionTypes.ARROW_UP });
        break;
      case 'Enter':
        // if input can be found in suggestions lists and user confirms
        if (suggestions.some((item) => item.itemValue === value)) {
          dispatchFn({ type: ActionTypes.SELECTED, value });
        }
        if (currentFocus !== null && currentFocus !== -1) {
          handleSelect(suggestions[currentFocus].itemValue!);
        }
    }
  };

  return {
    value,
    handleInputChange,
    suggestions,
    handleSelect,
    handleKeyDown,
    currentFocus,
  };
};

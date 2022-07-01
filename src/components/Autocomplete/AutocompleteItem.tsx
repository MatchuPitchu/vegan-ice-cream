import { useEffect, useRef, VFC } from 'react';

interface Props {
  itemValue: string;
  inputValue: string;
  restPart: string;
  currentFocus: boolean;
  onSelect: (itemValue: string) => void;
}

const AutocompleteItem: VFC<Props> = ({
  itemValue,
  inputValue,
  restPart,
  currentFocus,
  onSelect,
}) => {
  const autocompleteRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (currentFocus && autocompleteRef.current) {
      autocompleteRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentFocus]);

  return (
    <li
      tabIndex={currentFocus ? 0 : -1}
      ref={autocompleteRef}
      className={`autocomplete-list__item ${currentFocus && 'autocomplete-list__item--active'}`} // bisheriger class war 'suggestion-active'
      onClick={() => onSelect(itemValue)}
    >
      <span className='autocomplete-list__item--match'>{inputValue}</span>
      <span>{restPart}</span>
    </li>
  );
};

export default AutocompleteItem;

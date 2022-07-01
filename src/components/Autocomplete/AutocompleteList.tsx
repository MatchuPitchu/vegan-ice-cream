import { VFC } from 'react';
import AutocompleteItem from './AutocompleteItem';

interface Props {
  suggestions:
    | {
        itemValue: string;
        restPart: string;
      }[]
    | null;
  inputValue: string;
  currentFocus: number | null;
  onSelect: (itemValue: string) => void;
}

const AutocompleteList: VFC<Props> = ({ suggestions, inputValue, currentFocus, onSelect }) => {
  return (
    <ul className='autocomplete-list'>
      {suggestions?.map(({ itemValue, restPart }, index) => (
        <AutocompleteItem
          key={itemValue}
          inputValue={inputValue}
          itemValue={itemValue}
          restPart={restPart}
          currentFocus={currentFocus === index}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
};

export default AutocompleteList;

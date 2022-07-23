import { KeyboardEvent, ReactNode } from 'react';
import type { IceCreamLocation } from '../../types/types';
// Redux
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getSelectedLocation, locationsActions } from '../../store/locationsSlice';
import { searchActions } from '../../store/searchSlice';
import { IonIcon, IonInput, IonItem, IonLabel } from '@ionic/react';
import Highlighter from 'react-highlight-words';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { useAutocomplete } from '../../hooks/useAutocomplete';
import { trashOutline } from 'ionicons/icons';

type SearchProps = {
  label?: string | ReactNode;
  labelPosition?: 'stacked' | 'floating';
  type?: 'text' | 'number' | 'password';
  placeholder?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLIonInputElement>) => void;
  children?: ReactNode;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormProps<TFieldValues extends FieldValues> = SearchProps &
  UseControllerProps<TFieldValues>;

export const CustomSearchLocation = <TFieldValues extends FieldValues>({
  label,
  labelPosition = 'stacked',
  control,
  name,
  rules,
  type = 'text',
  placeholder,
  onKeyDown,
  children,
}: ReactHookFormProps<TFieldValues>) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController<TFieldValues>({
    control,
    name,
    rules,
  });

  const dispatch = useAppDispatch();

  const selectedLocation = useAppSelector(getSelectedLocation);
  const { locations } = useAppSelector((state) => state.locations);

  const { handleSearchTextChange, suggestions, searchWordsArray, selectSearchItem } =
    useAutocomplete<IceCreamLocation>(locations);

  const onSearchTextChanged = (searchInput: string) => handleSearchTextChange(searchInput, 5);

  return (
    <>
      <IonItem lines='full' className='item--card-background'>
        <IonLabel position={labelPosition} color={error && 'danger'}>
          {label}
        </IonLabel>
        <IonInput
          className={`input ${selectedLocation ? 'input--disabled' : ''}`}
          ref={ref}
          name={name}
          value={value}
          type={type}
          inputmode='text'
          onIonChange={({ detail: { value } }) => {
            onChange(value);
            onSearchTextChanged(value ?? '');
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
        />
        {(selectedLocation || value) && (
          <IonIcon
            onClick={() => {
              onChange('');
              dispatch(locationsActions.resetSelectedLocation());
            }}
            className='remove-icon'
            slot='end'
            icon={trashOutline}
          />
        )}
        {children}
      </IonItem>

      {suggestions.length > 0 &&
        value !== selectedLocation?.name &&
        suggestions.map((location, index) => (
          <IonItem
            className='item--suggestions item--item-background item--smallest'
            key={location._id}
            button
            onClick={() => {
              selectSearchItem(
                `${location.name}, ${location.address.street} ${location.address.number}, ${location.address.city}`
              );
              dispatch(locationsActions.setSelectedLocation(location._id));
            }}
            lines={suggestions.length - 1 === index ? 'none' : 'full'}
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
      {error && (
        <IonItem lines='none' className='item--smallest item--card-background'>
          <p className='paragraph--error-small'>{error.message}</p>
        </IonItem>
      )}
    </>
  );
};


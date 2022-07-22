import { KeyboardEvent, ReactNode } from 'react';
import type { Flavor } from '../../types/types';
// Redux
import { useGetFlavorsQuery } from '../../store/api/flavor-api-slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { flavorActions } from '../../store/flavorSlice';
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
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

export const CustomSearchFlavor = <TFieldValues extends FieldValues>({
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

  const { flavor } = useAppSelector((state) => state.flavor);

  const { data: flavors, error: errorGetFlavors, isLoading, isSuccess } = useGetFlavorsQuery();

  const { handleSearchTextChange, suggestions, searchWordsArray, selectSearchItem } =
    useAutocomplete<Flavor>(flavors ?? []);

  const onSearchTextChanged = (searchInput: string) => handleSearchTextChange(searchInput, 8);

  // TODO mit Keyboard Auswahl durchgehen und bestätigen
  return (
    <>
      <IonItem lines='full' className='item--card-background'>
        <IonLabel position={labelPosition} color={error && 'danger'}>
          {label}
        </IonLabel>
        <IonInput
          className={flavor ? 'input--disabled' : ''}
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
        {(flavor || value) && (
          <IonIcon
            onClick={() => dispatch(flavorActions.resetFlavor())}
            className='remove-icon'
            slot='end'
            icon={trashOutline}
          />
        )}
        {children}
      </IonItem>

      {suggestions.length > 0 && value !== flavor?.name && (
        <IonList className='item--card-background'>
          <div className='info-text'>... von anderen Nutzer:innen eingetragen</div>
          {suggestions.map((flavor) => (
            <IonItem
              key={flavor._id}
              className='item--card-background'
              button
              lines='full'
              onClick={() => {
                selectSearchItem(flavor.name);
                dispatch(flavorActions.setFlavor(flavor));
              }}
            >
              <Highlighter
                className='highlighter-wrapper'
                activeIndex={-1}
                highlightClassName='highlighter-wrapper__highlight'
                searchWords={searchWordsArray}
                caseSensitive={false}
                textToHighlight={`${flavor.name} ${flavor.type_fruit ? '• Sorbet' : ''} ${
                  flavor.type_cream ? '• Cremeeis' : ''
                }`}
              />
              <div
                className='flavor-search-preview'
                style={{
                  background: `linear-gradient(to bottom, ${flavor.color.primary}, ${
                    flavor.color.secondary ? flavor.color.secondary : flavor.color.primary
                  })`,
                }}
              />
            </IonItem>
          ))}
        </IonList>
      )}
      {error && (
        <IonItem lines='none' className='item--smallest item--card-background'>
          <p className='paragraph--error-small'>{error.message}</p>
        </IonItem>
      )}
    </>
  );
};


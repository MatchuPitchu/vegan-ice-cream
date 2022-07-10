import { Dispatch, SetStateAction, VFC } from 'react';
import { useAutocomplete } from '../../hooks/useAutocomplete';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions } from '../../store/appSlice';
import { locationsActions } from '../../store/locationsSlice';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import Highlighter from 'react-highlight-words';
import { IonSearchbar } from '@ionic/react';
import { searchCircleOutline, trash } from 'ionicons/icons';

interface SearchbarFormValues {
  city: string;
}

interface Props {
  setHideTopLocations: Dispatch<SetStateAction<boolean>>;
  setNoTopLocation: Dispatch<SetStateAction<boolean>>;
  noTopLocation: boolean;
  setCityName: Dispatch<SetStateAction<string>>;
}

// TODO: entfernen oder neu konzipiert in App einbetten
const SearchTopLocations: VFC<Props> = ({
  setHideTopLocations,
  setNoTopLocation,
  noTopLocation,
  setCityName,
}) => {
  const dispatch = useAppDispatch();
  const { citiesWithLocations } = useAppSelector((state) => state.locations);

  const { handleSearchTextChange, suggestions, setSuggestions, searchWords } =
    useAutocomplete<string>(citiesWithLocations);

  const { control, handleSubmit } = useForm<SearchbarFormValues>({
    defaultValues: { city: '' },
  });

  const {
    field: { onChange: onChangeReactHookForm, value, ref },
  } = useController({
    control,
    name: 'city',
  });

  const onSubmit: SubmitHandler<SearchbarFormValues> = async ({ city }: SearchbarFormValues) => {
    dispatch(appActions.setIsLoading(true));
    const cityCapitalized = city.replace(/^(.)|\s+(.)/g, (l) => l.toUpperCase());
    setCityName(cityCapitalized);
    try {
      const limit = 20;
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: cityCapitalized }),
        credentials: 'include',
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/locations/top-in-city?limit=${limit}`,
        options
      );
      const data = await response.json();
      if (data.length !== 0) {
        dispatch(locationsActions.setTopLocationsInCity(data));
        setHideTopLocations(false);
      } else {
        setNoTopLocation(true);
        setHideTopLocations(true);
      }
    } catch (error) {
      dispatch(appActions.setError('Ups, schief gelaufen. Versuche es später nochmal.'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }

    setSuggestions([]);
    dispatch(appActions.setIsLoading(false));
  };

  const handleInputChange = (searchText: string) => {
    if (noTopLocation) setNoTopLocation(false);
    onChangeReactHookForm(searchText);
    setCityName(searchText);

    if (!searchText) {
      setHideTopLocations(true);
      return;
    }
    handleSearchTextChange(searchText, 4);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <IonSearchbar
        className='searchbar--flavor'
        ref={ref}
        type='search'
        inputMode='search'
        placeholder='Stadtname ...'
        showCancelButton='never'
        showClearButton='always'
        clearIcon={trash}
        searchIcon={searchCircleOutline}
        value={value}
        debounce={0}
        onIonChange={({ detail: { value } }) => handleInputChange(value ?? '')}
      />

      {suggestions.length > 0 && (
        <div className={`predict-cities`}>
          {suggestions.map((city) => (
            <div
              key={city}
              className='predict-cities__item'
              onClick={() => handleSubmit(onSubmit({ city }))}
            >
              <Highlighter
                className='hightlighter-wrapper'
                activeIndex={-1}
                highlightClassName='highlight'
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={city}
              />
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchTopLocations;

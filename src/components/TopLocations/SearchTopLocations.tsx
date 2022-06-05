import { Dispatch, SetStateAction, useContext, VFC } from 'react';
import { useAutocomplete } from '../../hooks/useAutocomplete';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions } from '../../store/appSlice';
import { locationsActions } from '../../store/locationsSlice';
// Context
import { Context } from '../../context/Context';
import { Controller, useForm } from 'react-hook-form';
import Highlighter from 'react-highlight-words';
import { IonItem, IonSearchbar, isPlatform } from '@ionic/react';
import LoadingError from '../LoadingError';

interface Props {
  setHideTopLocations: Dispatch<SetStateAction<boolean>>;
  setNoTopLocation: Dispatch<SetStateAction<boolean>>;
  noTopLocation: boolean;
  setCityName: Dispatch<SetStateAction<string>>;
}

const SearchTopLocations: VFC<Props> = ({
  setHideTopLocations,
  setNoTopLocation,
  noTopLocation,
  setCityName,
}) => {
  const dispatch = useAppDispatch();
  const { citiesWithLocations } = useAppSelector((state) => state.locations);

  const { isDarkTheme } = useContext(Context);

  const { handleSearchTextChange, predictions, setPredictions, searchWords } =
    useAutocomplete<string>(citiesWithLocations);

  const { control, handleSubmit } = useForm();

  const onSubmit = async ({ city }: { city: string }) => {
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

    setPredictions([]);
    dispatch(appActions.setIsLoading(false));
  };

  const onSearchTextChanged = (searchText: string) => {
    if (!searchText) {
      setHideTopLocations(true);
      // no return here since execution stops in handleSearchTextChange()
    }

    handleSearchTextChange(searchText, 4);
  };

  return (
    <form className='container' onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='city'
        control={control}
        render={({ field: { onChange, value } }) => (
          <IonSearchbar
            className='searchbar'
            type='search'
            inputMode='search'
            placeholder='Stadtname ...'
            showCancelButton='always'
            showClearButton='always'
            cancel-button-text=''
            value={value}
            debounce={0}
            onIonChange={({ detail: { value } }) => {
              onChange(value);
              setCityName(value ?? '');
              if (noTopLocation) setNoTopLocation(false);
              onSearchTextChanged(value ?? '');
            }}
          />
        )}
      />
      {predictions.length !== 0 && (
        <div
          className={`py-0 d-flex flex-row flex-wrap container ${
            isPlatform('desktop') ? '' : 'justify-content-center'
          }`}
        >
          {predictions.map((city) => (
            <IonItem
              key={city}
              className='predictItem mx-1'
              button
              onClick={() => onSubmit({ city })}
              lines='none'
              color={`${isDarkTheme ? '' : 'secondary'}`}
            >
              <Highlighter
                className='hightlighter-wrapper'
                activeIndex={-1}
                highlightClassName='highlight'
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={city}
              />
            </IonItem>
          ))}
        </div>
      )}

      <LoadingError />
    </form>
  );
};

export default SearchTopLocations;

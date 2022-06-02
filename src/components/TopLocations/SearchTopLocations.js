import { useContext, useState } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions } from '../../store/appSlice';
// Context
import { Context } from '../../context/Context';
import { Controller, useForm } from 'react-hook-form';
import Highlighter from 'react-highlight-words';
import { IonItem, IonSearchbar, isPlatform } from '@ionic/react';
import LoadingError from '../LoadingError';

const SearchTopLocations = () => {
  const dispatch = useAppDispatch();
  const { citiesWithLocations } = useAppSelector((state) => state.locations);

  const {
    isDarkTheme,
    setTopLocations,
    setCityName,
    noTopLocation,
    setNoTopLocation,
    setHideTopLocations,
  } = useContext(Context);

  const [predictions, setPredictions] = useState([]);
  const [searchWords, setSearchWords] = useState([]);

  const { control, handleSubmit } = useForm();

  const onSubmit = async ({ city }) => {
    dispatch(appActions.setIsLoading(true));
    const cityCapitalized = city.replace(/^(.)|\s+(.)/g, (l) => l.toUpperCase());
    setCityName(cityCapitalized);
    try {
      const limit = 20;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: cityCapitalized }),
        credentials: 'include',
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/locations/top-in-city?limit=${limit}`,
        options
      );
      const data = await res.json();
      if (data.length) {
        setTopLocations(data);
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

  const handleSearchTextChange = (value) => {
    if (noTopLocation) {
      setNoTopLocation(false);
    }

    if (!value) {
      setPredictions([]);
      setNoTopLocation(false);
      setHideTopLocations(true);
      return;
    }

    const searchTerms = value.split(/\s/).filter(Boolean); // create array of search terms, remove all whitespaces
    const filteredCities = citiesWithLocations.filter((city) => {
      const text = `${city}`.toLowerCase();
      return searchTerms.every((searchTerm) => text.includes(searchTerm.toLowerCase()));
    });

    setPredictions(filteredCities.slice(0, 4));
    setSearchWords(searchTerms);
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
            onIonChange={({ detail }) => {
              onChange(detail.value);
              setCityName(detail.value);
              handleSearchTextChange(detail.value ?? '');
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

import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { Controller, useForm } from "react-hook-form";
import Highlighter from "react-highlight-words";
import { IonItem, IonSearchbar, isPlatform } from '@ionic/react';
import LoadingError from './LoadingError';

const Search = () => {
  const {
    toggle,
    setLoading,
    setError,
    cities,
    setTopLocations,
    cityName, setCityName,
    noTopLoc, setNoTopLoc,
  } = useContext(Context);
  const [predictions, setPredictions] = useState([]);
  const [showPredict, setShowPredict] = useState(false);
  const [searchWords, setSearchWords] = useState([]);
  
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({city}) => {
    setLoading(true);
    setCityName(city);

    try {
      const limit = 15;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // converts JS data into JSON string.
        body: JSON.stringify({ city }),
        credentials: "include",
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/locations/top-in-city?limit=${limit}`, options)
      const data = await res.json();
      if(data.length) {
        setTopLocations(data);
      } else {
        setTopLocations([]);
        setNoTopLoc(true);
      }
    } catch (error) {
      setError('Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in Deutschland eintragen.')
      setTimeout(() => setError(null), 5000);
    }

    setPredictions([]);
    setShowPredict(false);
    setLoading(false);  
  }

  const forAutocompleteChange = async (value) => {
    if(value) {
      // make array from input string -> each item is created after one space " "
      const searchQuery = value.split(' ').filter(word => word);
      const res = await cities.filter(city => {
        const found = searchQuery.map(word => {
          // return if exists just a space or a space and then nothing
          if (word === " " || word === "") return;
          // explanation: http://stackoverflow.com/a/18622606/1147859
          const reg = "(" + word + ")(?![^<]*>|[^<>]*</)";
          // i means case-insensitive mode
          const regex = new RegExp(reg, "i");
          return regex.test(city)
        });
        // found is array with as many items as there are search words
        // if every item is true, than this location is returned
        if(found.every(v => v === true)) return city;
      });
      const result = res.slice(0, 2);
      setPredictions(result);
      value !== cityName && setShowPredict(true);
    }
    if(!value) {
      setPredictions([]);
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit(onSubmit)}>
      <Controller 
        name="city"
        control={control}
        render={({ field: { onChange, value } }) => (
          <IonSearchbar
            className="searchbar"
            type="search"
            inputMode="search"
            placeholder="Top Eisläden in deiner Stadt" 
            showCancelButton="always"
            showClearButton="always"
            cancel-button-text=""
            value={value}
            debounce={0}
            onIonChange={e => {
              onChange(e.detail.value);
              setCityName(e.detail.value);
              forAutocompleteChange(e.detail.value);
              setSearchWords(() => e.detail.value.split(' ').filter(word => word));
              noTopLoc && setNoTopLoc(false);
            }}
          />
        )}
      />
      {predictions && showPredict ? (
        <div className={`py-0 d-flex flex-row container ${isPlatform('desktop') ? "" : "justify-content-center"}`}>
          {predictions.map((city, i) => (
            <IonItem
              key={i}
              className="predictItem"
              button 
              onClick={() => onSubmit({ city }) }
              lines="none"
              color={`${toggle ? "" : "secondary"}`}
            >
              <Highlighter
                className="hightlighter-wrapper"
                activeIndex={-1}
                highlightClassName="highlight"
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={city}
              />
            </IonItem>
          ))}
        </div>
      ) : null}

      <LoadingError />

    </form>
  )
}

export default Search
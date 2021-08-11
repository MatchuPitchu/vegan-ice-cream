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
    showTopLoc, setShowTopLoc,
  } = useContext(Context);
  const [predictions, setPredictions] = useState([]);
  const [showPredict, setShowPredict] = useState(false);
  const [searchWords, setSearchWords] = useState([]);
  
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({city}) => {
    setLoading(true);
    const cityCapitalized = city.replace(/^(.)|\s+(.)/g, l => l.toUpperCase())
    setCityName(cityCapitalized);
    try {
      const limit = 20;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // converts JS data into JSON string
        // backend expects key city
        body: JSON.stringify({ city: cityCapitalized }),
        credentials: "include",
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/locations/top-in-city?limit=${limit}`, options)
      const data = await res.json();
      if(data.length) {
        setTopLocations(data);
        setShowTopLoc(true)
      } else {
        setNoTopLoc(true);
        setShowTopLoc(false)
      }
    } catch (error) {
      setError('Ups, schief gelaufen. Versuche es später nochmal.')
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
      const result = res.slice(0, 4);
      setPredictions(result);
      value !== cityName && setShowPredict(true);
    }
    if(!value) {
      setPredictions([]);
      setNoTopLoc(false);
      setShowTopLoc(false);
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
            placeholder="Stadtname ..."
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
        <div className={`py-0 d-flex flex-row flex-wrap container ${isPlatform('desktop') ? "" : "justify-content-center"}`}>
          {predictions.map((city, i) => (
            <IonItem
              key={i}
              className="predictItem mx-1"
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
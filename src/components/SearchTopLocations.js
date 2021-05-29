import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import Highlighter from "react-highlight-words";
import { IonItem, IonList, IonSearchbar, isPlatform } from '@ionic/react';
import LoadingError from './LoadingError';

const Search = () => {
  const {
    toggle,
    setLoading,
    setError,
    cities,
    setTopLocations,
    searchText, setSearchText,
  } = useContext(Context);
  const [predictions, setPredictions] = useState([]);
  const [showPredict, setShowPredict] = useState(false);
  const [searchWords, setSearchWords] = useState([]);
  const [cityName, setCityName] = useState('');
  

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true);
    const city = e.target[0].value;
    
    try {
      const limit = 20;
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
      setTopLocations(data);
    } catch (error) {
      setError('Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in Deutschland eintragen.')
      setTimeout(() => setError(null), 5000);
    }

    setPredictions([]);
    setLoading(false);
  };

  const selectCity = async city => {
    setLoading(true);
    try {
      const limit = 20;
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
      setTopLocations(data);
    } catch (error) {
      setError('Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in Deutschland eintragen.')
      setTimeout(() => setError(null), 5000);
    }

    setPredictions([]);
    setLoading(false);  
  }

  const forAutocompleteChange = async () => {
    if(searchText.length >= 2) {
      // make array from input string -> each item is created after one space " "
      const searchQuery = searchText.split(' ').filter(word => word);
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
      const result = res.slice(0, 3);
      setPredictions(result);
    }
    if(!searchText) {
      setPredictions([]);
    }
  };

  return (
    <form className="container" onSubmit={onSubmit}>
      <IonSearchbar 
        className="searchbar"
        type="search"
        inputMode="search"
        placeholder="Top Läden in deiner Stadt anzeigen" 
        showCancelButton="always" 
        cancel-button-text=""
        value={searchText}
        debounce={500}
        onIonChange={e => {
          setSearchText(e.detail.value);
          forAutocompleteChange();
          setSearchWords(() => e.detail.value.split(' ').filter(word => word));
          searchText !== cityName && setShowPredict(true);
        }}
      />
      {predictions && showPredict ? (
        <div className={`py-0 d-flex flex-row container ${isPlatform('desktop') ? "" : "justify-content-center"}`}>
          {predictions.map((city, i) => (
            <IonItem
              key={i}
              className="predictItem"
              button 
              onClick={() => {
                setSearchText(city);
                selectCity(city);
                setCityName(city);
                setShowPredict(false);
              }}
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
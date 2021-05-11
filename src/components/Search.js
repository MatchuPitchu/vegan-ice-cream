import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonSearchbar, IonToolbar } from '@ionic/react';

const Search = () => {
  const { 
    loading, setLoading,
    error, setError,
    setAll,
    locations,
    selected, setSelected,
    searchText, setSearchText,
  } = useContext(Context);
  const [ predictions, setPredictions ] = useState([]);

  console.log(locations);

  const onSubmit = () => {
    setLoading(true)
    const res = locations.filter(loc => loc.name.toLowerCase().includes(searchText.toLowerCase()) || loc.address.city.toLowerCase().includes(searchText.toLowerCase()) );
    const result = res.slice(0, 10);
    setPredictions(result);
    setLoading(false)
  }

    // Debounce Autocomplete functions
    const debounce = (func, timeout = 1000) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args)}, timeout);
      };
    }
    
    const forAutocompleteChange = debounce(value => {
      if(value.length >= 3 && locations) {
        const res = locations.filter(loc => loc.name.toLowerCase().includes(value.toLowerCase()) || loc.address.city.toLowerCase().includes(value.toLowerCase()) );
        const result = res.slice(0, 10);
        setPredictions(result);
      }
      if(!value) {
        setPredictions([])
      }
    });

  return (
    <form className="container" onSubmit={onSubmit}>
      <IonItem lines="full">
        <IonSearchbar 
          className="searchbar container" 
          type="search" 
          placeholder="Eisladen suchen" 
          showCancelButton="always" 
          cancel-button-text=""
          value={searchText}
          onIonChange={e => {
            setAll(true);
            setSearchText(e.detail.value);
            forAutocompleteChange(e.detail.value)
          }}
        />
      </IonItem>
      {predictions ? (
        <IonList>
          {predictions.map(loc => (
            <IonItem 
              className="autocompleteListItem" 
              key={loc._id} 
              button 
              onClick={() => { 
                setSelected(loc); 
                setPredictions([]) 
              }} 
              lines="full"
            >
              <IonLabel color="secondary" className="ion-text-wrap">{loc.name} <span className="p-weak">, {loc.address.street} {loc.address.number} in {loc.address.city}</span></IonLabel>
            </IonItem>
          ))}
        </IonList>
      ) : null}
    </form>
  )
}

export default Search

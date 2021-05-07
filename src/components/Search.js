import { useContext } from 'react';
import { Context } from '../context/Context';
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
import { IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonSearchbar } from '@ionic/react';

const Search = () => {
const { searchText, setSearchText } = useContext(Context);

const handleChange = address => {
  setSearchText(address);
}

const handleSelect = async (address) => {
  try {
    const res = await geocodeByAddress(address);
    const data = getLatLng(res[0]);
    console.log('Success', data)
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="container">
      <IonSearchbar 
        className="searchbar container" 
        type="search" 
        placeholder="Debounce 3s" 
        showCancelButton="always" 
        cancel-button-text=""
        value={searchText}
        onIonChange={e => {
          setSearchText(e.detail.value);
        }}        
      />
      <PlacesAutocomplete
        value={searchText}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'searchbar container',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      
      {/* <IonSearchbar 
        className="searchbar container" 
        type="search" 
        placeholder="Debounce 3s" 
        showCancelButton="always" 
        cancel-button-text=""
        value={searchText}
        onIonChange={e => {
          getPlacePredictions({ input: e.detail.value});
          setSearchText(e.detail.value);
        }}
        loading={isPlacePredictionsLoading}
      />
      {!isPlacePredictionsLoading && (
        <IonList className="listSearch">
          {placePredictions.map((item, i) => (
            <IonItemSliding key={i}>
              <IonItem button onClick={() => setSearchText(item.description)}>
                <IonLabel>{item.description}</IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption onClick={() => {}}>Unread</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      )} */}
    </div>
  )
}

export default Search

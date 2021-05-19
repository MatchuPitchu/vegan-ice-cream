import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { add, informationCircle } from 'ionicons/icons';

const Search = () => {
  const { 
    loading, setLoading,
    // setAll,
    setCenter,
    setZoom,
    locations,
    setSearchSelected,
    searchText, setSearchText,
  } = useContext(Context);
  const [ predictions, setPredictions ] = useState([]);
  const [ popoverShow, setPopoverShow ] = useState({ show: false, event: undefined });

  const onSubmit = (e) => {
    e.preventDefault();
    const res = locations.filter(loc => loc.name.toLowerCase().includes(searchText.toLowerCase()) || loc.address.city.toLowerCase().includes(searchText.toLowerCase()) );
    const result = res.slice(0, 10);
    setPredictions(result);
  }

  const forAutocompleteChange = async value => {
    if(value.length >= 3 && locations) {
      const res = await locations.filter(loc => loc.name.toLowerCase().includes(value.toLowerCase()) || loc.address.city.toLowerCase().includes(value.toLowerCase()) );
      const result = res.slice(0, 10);
      setPredictions(result);
    }
    if(!value) {
      setPredictions([])
      setSearchSelected(null)
    }
  };

  const initMarker = (loc) => {
    setSearchSelected(loc); 
    setPredictions([]);
    setCenter({lat: loc.address.geo.lat, lng: loc.address.geo.lng})
    setZoom(14);
  }

  return (
    <form onSubmit={onSubmit}>
      <IonItem className="searchbar" lines="none">
        <IonSearchbar 
          className="searchbar container" 
          type="search"
          inputMode="search"
          placeholder="Eisladen suchen" 
          showCancelButton="always" 
          cancel-button-text=""
          value={searchText}
          debounce={100}
          onIonChange={e => {
            setSearchText(e.detail.value);
            forAutocompleteChange(e.detail.value)
          }}
        />
        <IonIcon
          className="infoIcon"
          color="primary"
          button 
          onClick={e => {
            e.persist();
            setPopoverShow({ show: true, event: e })
          }}
          icon={informationCircle} 
        />
        <IonPopover
          color="primary"
          cssClass='info-popover'
          event={popoverShow.event}
          isOpen={popoverShow.show}
          onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
        >
          Nichts gefunden? Trage den Eisladen zuerst auf der Karte ganz unten ein
        </IonPopover>
      </IonItem>
      {predictions ? (
        <IonList className="py-0">
          {predictions.map(loc => (
            <IonItem 
              className="autocompleteListItem" 
              key={loc._id} 
              button 
              onClick={() => {
                setSearchText(`${loc.name}, ${loc.address.street} ${loc.address.number}, ${loc.address.city}`);
                initMarker(loc)}
              }
              lines="full"
            >
              <IonLabel color="primary" className="ion-text-wrap">{loc.name} <span className="p-weak">, {loc.address.street} {loc.address.number} in {loc.address.city}</span></IonLabel>
            </IonItem>
          ))}
        </IonList>
      ) : null}
    </form>
  )
}

export default Search

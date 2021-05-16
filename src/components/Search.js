import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { add, informationCircle } from 'ionicons/icons';

const Search = () => {
  const { 
    loading, setLoading,
    error, setError,
    // setAll,
    setCenter,
    setZoom,
    locations,
    searchSelected, setSearchSelected,
    searchText, setSearchText,
  } = useContext(Context);
  const [ predictions, setPredictions ] = useState([]);
  const [ popoverShow, setPopoverShow ] = useState({ show: false, event: undefined });

  const onSubmit = () => {
    setLoading(true)
    const res = locations.filter(loc => loc.name.toLowerCase().includes(searchText.toLowerCase()) || loc.address.city.toLowerCase().includes(searchText.toLowerCase()) );
    const result = res.slice(0, 10);
    setPredictions(result);
    setLoading(false)
  }

  const forAutocompleteChange = async value => {
    if(value.length >= 2 && locations) {
      const res = await locations.filter(loc => loc.name.toLowerCase().includes(value.toLowerCase()) || loc.address.city.toLowerCase().includes(value.toLowerCase()) );
      const result = res.slice(0, 10);
      setPredictions(result);
    }
    if(!value) {
      setPredictions([])
      setSearchSelected(null)
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <IonItem className="searchbar" lines="none">
        <IonSearchbar 
          className="searchbar container" 
          type="search" 
          placeholder="Eisladen suchen" 
          showCancelButton="always" 
          cancel-button-text=""
          value={searchText}
          onIonChange={e => {
            // setAll(true);
            setSearchText(e.detail.value);
            setTimeout(() => forAutocompleteChange(e.detail.value), 3000)
            
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
          Nichts gefunden? Trage den Eisladen zuerst auf der Karte ein
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
                setSearchSelected(loc); 
                setPredictions([])
                setCenter({lat: loc.address.geo.lat, lng: loc.address.geo.lng})
                setZoom(12)
              }} 
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

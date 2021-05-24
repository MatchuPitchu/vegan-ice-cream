import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import Highlighter from "react-highlight-words";
import { IonIcon, IonItem, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { informationCircle } from 'ionicons/icons';

const Search = () => {
  const { 
    setCenter,
    setZoom,
    locations,
    setSearchSelected,
    searchText, setSearchText,
  } = useContext(Context);
  const [ predictions, setPredictions ] = useState([]);
  const [ popoverShow, setPopoverShow ] = useState({ show: false, event: undefined });
  const [ searchWords, setSearchWords ] = useState([]);

  const onSubmit = e => e.preventDefault();

  const forAutocompleteChange = async value => {
    if(value.length >= 3 && locations) {
      // make array from input string -> each item is created after one space " "
      const searchQuery = value.split(' ').filter(word => word);
      const res = await locations.filter(loc => {
        const found = searchQuery.map(word => {
          // return if exists just a space or a space and then nothing
          if (word === " " || word === "") return;
          // explanation: http://stackoverflow.com/a/18622606/1147859
          const reg = "(" + word + ")(?![^<]*>|[^<>]*</)";
          // i means case-insensitive mode
          const regex = new RegExp(reg, "i");
          console.log('regex test:', loc.name, regex.test(`${loc.name} ${loc.address.street} ${loc.address.number} ${loc.address.city}`) )
          return regex.test(`${loc.name} ${loc.address.street} ${loc.address.number} ${loc.address.city}`)
        });
        // found is array with as many items as there are search words
        // if every item is true, than this location is returned
        if(found.every(v => v === true)) return loc;
      });
      const result = res.slice(0, 4);
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
            forAutocompleteChange(e.detail.value);
            setSearchWords(() => e.detail.value.split(' ').filter(word => word))
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
              <Highlighter
                className="hightlighter-wrapper"
                activeIndex={-1}
                highlightClassName="highlight"
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={`${loc.name}, ${loc.address.street} ${loc.address.number} in ${loc.address.city}`}
              />
            </IonItem>
          ))}
        </IonList>
      ) : null}
    </form>
  )
}

export default Search

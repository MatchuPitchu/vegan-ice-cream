import { useContext, useState, useEffect } from 'react';
import { Context } from '../context/Context';
import Highlighter from "react-highlight-words";
import { IonIcon, IonItem, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { iceCream, informationCircle } from 'ionicons/icons';
import LoadingError from '../components/LoadingError';

const SearchFlavors = () => {
  const { 
    setLoading,
    searchFlavor, setSearchFlavor,
    flavor, setFlavor,
    finishComment, setFinishComment,
  } = useContext(Context);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });
  const [flavors, setFlavors] = useState([]);
  const [searchWords, setSearchWords] = useState([]);
  const [flavorsPredict, setFlavorsPredict] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchFlavors = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/flavors`)
        const data = await res.json();
        setFlavors(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchFlavors();
    setLoading(false);
  }, [finishComment])

  const forAutocompleteChange = value => {
    if(value.length >= 3 && flavors) {
      // make array from input string -> each item is created after one space " "
      const searchQuery = value.split(' ').filter(word => word);
      const res = flavors.filter(flavor => {
        const found = searchQuery.map(word => {
          // return if exists just a space or a space and then nothing
          if (word === " " || word === "") return;
          // explanation: http://stackoverflow.com/a/18622606/1147859
          const reg = "(" + word + ")(?![^<]*>|[^<>]*</)";
          // i means case-insensitive mode
          const regex = new RegExp(reg, "i");
          return regex.test(flavor.name)
        });
        // found is array with as many items as there are search words
        // if every item is true, than this location is returned
        if(found.every(v => v === true)) return flavor;
      });
      const result = res.slice(0, 5);
      setFlavorsPredict(result);
    }
    if(!value) setFlavorsPredict([]);
  };

  return (
    <>
      <div className="d-flex align-items-center" style={{backgroundColor: 'var(--ion-item-background)'}}>
        <IonSearchbar
          className="searchbar" 
          type="search"
          inputMode="text"
          placeholder="Name Eissorte eintippen"
          showCancelButton="always"
          showClearButton="always"
          searchIcon={iceCream}
          cancel-button-text=""
          spellcheck={true}
          autocorrect="on"
          value={searchFlavor}
          debounce={100}
          onIonChange={e => {
            setSearchFlavor(e.detail.value);
            forAutocompleteChange(e.detail.value);
            setSearchWords(() => e.detail.value.split(' ').filter(word => word))
          }}
          onIonCancel={() => setFlavor({})}
          onIonClear={() => setFlavor({})}
          onKeyUp={(e) => e.key === 'Enter' && setFlavorsPredict([])}
        />
        <div>
          <IonIcon
            className="infoIcon me-3"
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
            Keine passenden Vorschläge? Tippe einfach den Namen der neuen Eissorte ein.
          </IonPopover>
        </div>
      </div>
      
      {flavorsPredict.length && searchFlavor !== flavor.name ? (
        <IonList className="py-0">
          <div className="infoText pt-2" >... Auswahl bereits eingetragener Sorten</div>
          {flavorsPredict.map(flavor => (
            <IonItem
              key={flavor._id}
              button 
              onClick={() => {
                setFlavor(flavor);
                setFlavorsPredict([]);
                setSearchFlavor(flavor.name);
              }}
              lines="full"
            >
              <Highlighter
                className="hightlighter-wrapper"
                activeIndex={-1}
                highlightClassName="highlight"
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={`${flavor.name} ${flavor.type_fruit ? '| Fruchteis' : ''} ${flavor.type_cream ? '| Cremeeis' : ''}`}
              />
              <div className="flavor-search-preview" style={{background: `linear-gradient(to bottom, ${flavor.color.primary}, ${flavor.color.secondary ? flavor.color.secondary : flavor.color.primary})`}}></div>
            </IonItem>
          ))} 
        </IonList>
      ) : null}
      <LoadingError />
    </>
  )
}

export default SearchFlavors
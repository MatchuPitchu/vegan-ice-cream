import { useContext, useState, useEffect } from 'react';
import { Context } from '../context/Context';
import Highlighter from "react-highlight-words";
import { IonIcon, IonItem, IonLabel, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { informationCircle } from 'ionicons/icons';
import LoadingError from '../components/LoadingError';

const SearchFlavors = () => {
  const { 
    setLoading,
    searchFlavor, setSearchFlavor,
    flavor, setFlavor
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
  }, [])

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
      const result = res.slice(0, 4);
      setFlavorsPredict(result);
    }
    if(!value) setFlavorsPredict([]);
  };

  return (
    <>
      <IonItem lines="none">
        <IonLabel htmlFor="name1">Eissorte</IonLabel>
        <IonIcon
          className="infoIcon ms-auto"
          color="primary"
          slot="end"
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
          Du siehst keine Vorschläge oder die Vorschläge passen nicht zu deiner Eissorte? Dann tippe einfach den vollständigen Namen der neuen Eissorte ein.
        </IonPopover>
      </IonItem>
      <IonItem lines="none">
        <IonSearchbar
          className="searchbar" 
          type="search"
          inputMode="search"
          placeholder="Was hast du probiert?" 
          showCancelButton="always" 
          cancel-button-text=""
          value={searchFlavor}
          debounce={100}
          onIonChange={e => {
            setSearchFlavor(e.detail.value);
            forAutocompleteChange(e.detail.value);
            setSearchWords(() => e.detail.value.split(' ').filter(word => word))
          }}
          onIonCancel={() => setFlavor({})}
          onIonClear={() => setFlavor({})}
        />
      </IonItem>
      {flavorsPredict && searchFlavor !== flavor.name ? (
        <IonList className="py-0">
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
            </IonItem>
          ))} 
        </IonList>
      ) : null}
      <LoadingError />
    </>
  )
}

export default SearchFlavors
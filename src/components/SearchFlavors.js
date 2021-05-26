import { useContext, useState, useEffect } from 'react';
import { Context } from '../context/Context';
import Highlighter from "react-highlight-words";
import { IonIcon, IonItem, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { informationCircle } from 'ionicons/icons';

const SearchFlavors = () => {
  const { 
    setLoading,
    setError,
    setCenter,
    setZoom,
    setSearchSelected,
    searchFlavor, setSearchFlavor
  } = useContext(Context);
  const [flavors, setFlavors] = useState([]);
  const [flavorsPredict, setFlavorsPredict] = useState([]);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });
  const [searchWords, setSearchWords] = useState([]);

  useEffect(() => {
    const fetchFlavors = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/flavors`)
        const data = await res.json();
        console.log(data);
        setFlavors(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchFlavors();
  }, [])


  // const onSubmit = async e => {
  //   e.preventDefault();
  //   if(e.target.elements[0].value.length > 3) {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(e.target.elements[0].value)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
  //       const { results } = await res.json();
       
  //       if(results[0].geometry.location) {
  //         setCenter({
  //           lat: results[0].geometry.location.lat,
  //           lng: results[0].geometry.location.lng
  //         });
  //         setZoom(13);
  //       }
  //     } catch (error) {
  //       setError('Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in Deutschland eintragen.')
  //       setTimeout(() => setError(null), 5000);
  //     }
  //     setLoading(false);
  //   }
  // }

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
    if(!value) {
      setFlavorsPredict([]);
      setSearchSelected(null)
    }
  };

  const initFlavor = (loc) => {
    // setSearchSelected(loc); 
    setFlavorsPredict([]);
    // setCenter({
    //   lat: loc.address.geo.lat, 
    //   lng: loc.address.geo.lng
    // })
    // setZoom(14);
  }

  return (
    <>
      <IonItem lines="none">
        <IonSearchbar
          className="searchbar container" 
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
        />
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
          Werden dir keine Vorschläge angezeigt? Dann tippe einfach den vollständigen Namen der neuen Eissorte ein.
        </IonPopover>

      </IonItem>
      {flavorsPredict ? (
        <IonList className="py-0">
          {flavorsPredict.map(flavor => (
            <IonItem
              key={flavor._id}
              button 
              onClick={() => {
                setSearchFlavor(flavor.name);
                setFlavorsPredict([]);
                // initFlavor(flavor)
              }}
              lines="full"
            >
              <Highlighter
                className="hightlighter-wrapper"
                activeIndex={-1}
                highlightClassName="highlight"
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={flavor.name}
              />
            </IonItem>
          ))}
        </IonList>
      ) : null}
    </>

  )
}

export default SearchFlavors
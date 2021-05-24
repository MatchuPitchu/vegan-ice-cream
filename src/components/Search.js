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

  const onSubmit = (e) => {
    e.preventDefault();
    const res = locations.filter(loc => loc.name.toLowerCase().includes(searchText.toLowerCase()) || loc.address.city.toLowerCase().includes(searchText.toLowerCase()) );
    const result = res.slice(0, 10);
    setPredictions(result);
  }

  const forAutocompleteChange = async value => {
    if(value.length >= 3 && locations) {

      const res = await locations.filter(loc => {
        const found = searchWords.map(word => {
          // return if exists just a space or a space and then nothing
          if (word === " " || word === "") return;
          // explanation: http://stackoverflow.com/a/18622606/1147859
          const reg = "(" + word + ")(?![^<]*>|[^<>]*</)";
          // i means case-insensitive mode
          const regex = new RegExp(reg, "i");
          console.log('regex test:', loc.name, regex.test(loc.name + loc.address.city) )
          return regex.test(loc.name + loc.address.city)
        });
        console.log("found", found)
        if(found.every(v => v === true)) return loc;
      });
      
      console.log('res', res)
      
      const result = res.slice(0, 10);
      setPredictions(result);
    }
    if(!value) {
      setPredictions([])
      setSearchSelected(null)
    }
  };

  // const forAutocompleteChange = async value => {
  //   if(value.length >= 3 && locations) {

  //     // HAVE TO COMBINE https://benfrain.com/building-search-results-and-highlighting-matches-with-regex/
  //     // AND THIS https://github.com/bvaughn/react-highlight-words

  //     // const highlightMatches = (string, query) => {
  //     //   // the completed string will be itself if already set, otherwise, the string that was passed in
  //     //   var completedString = completedString || string;
  //     //   query.forEach(word => {
  //     //     const reg = "(" + word + ")(?![^<]*>|[^<>]*</)";
  //     //     const regex = new RegExp(reg, "i");
  //     //     // return if regex does not match string
  //     //     if(!string.match(regex)) return;
  //     //     // set highlighting
  //     //     const matchStart = string.match(regex).index;
  //     //     const matchEnd = matchStart + string.match(regex)[0].toString().length;
  //     //     const textFound = string.substring(matchStart, matchEnd);

  //     //     completedString = completedString.replace(regex, `<span class="highlight">${textFound}</span>`)
  //     //   })
  //     //   console.log("completedString:", completedString)
  //     //   setPredictions(prev => [...prev, completedString]);
  //     // }


  //     const buildPredictions = (query, loc) => {
  //       // make array from input string -> each item is created after one space " "
  //       query = query.split(" ");
        
  //       console.log('query.split:', query)

  //       query.forEach(word => {
  //         // return if exists just a space or a space and then nothing
  //         if (word === " " || word === "") return;
  //         // explanation: http://stackoverflow.com/a/18622606/1147859
  //         const reg = "(" + word + ")(?![^<]*>|[^<>]*</)";
  //         // i means case-insensitive mode
  //         const regex = new RegExp(reg, "i");

  //         // remove loc from predictions array if condition is given
  //         if ( 
  //           !loc.name.match(regex) &&
  //           !loc.address.city.match(regex)
  //           // !loc.address.street.match(regex) && 
  //           // !loc.address.number.match(regex) && 
  //           // !loc.address.zipcode.match(regex)
  //         ) {
  //           const index = predictions.findIndex(pre => pre.name === loc.name && pre.address.city === loc.address.city)
  //           console.log('index:', index)
  //           if(index !== -1) setPredictions(() => predictions.splice(index, 1));
  //           return
  //         };
          
  //         // add loc to predictions array if condition is given
  //         if ( loc.name.match(regex) && loc.address.city.match(regex) ) {
  //           const index = predictions.findIndex(pre => pre.name === loc.name && pre.address.city === loc.address.city)
  //           console.log('index:', index)
  //           if(index === -1) setPredictions(prev => [...prev, loc]);
  //         }

  //         // highlightMatches(loc.name, query);        
  //       });
  //     }

  //     // for (let i = 0; i < locations.length; i++) {
  //     //   buildPredictions(value, locations[i])
  //     // }


      
  //     // const res = stringForSearchArr.filter(string => string.match(regex) );
  //     // console.log(res);
  //     // const result = res.slice(0, 10);
  //     // setPredictions(result);

  //     const buildPredict = (query, string) => {
  //       // make array from input string -> each item is created after one space " "
  //       query = query.split(" ");
  //       console.log('query.split:', query)

  //       query.forEach(word => {
  //         // return if exists just a space or a space and then nothing
  //         if (word === " " || word === "") return;
  //         // explanation: http://stackoverflow.com/a/18622606/1147859
  //         const reg = "(" + word + ")(?![^<]*>|[^<>]*</)";
  //         // i means case-insensitive mode
  //         const regex = new RegExp(reg, "i");
          
  //         if(!string.match(regex)) {
  //           const index = result.findIndex(item => item === string)
  //           console.log('indexREMOVE:', index)
  //           if(index !== -1) setResult(() => result.splice(index, 1));
  //           return
  //         }
  //         console.log('result', string.match(regex))

  //         const index = result.findIndex(item => item === string);
  //         console.log('indexADD', index)
  //         if(index === -1) setResult(() => [...result, string])   

  //       //   const res = stringForSearchArr.filter(string => {
  //       //     if(!string.match(regex)) return
  //       //     string.match(regex)
  //       //   })

  //       // setResult(() => [result, stringForSearchArr.filter(string => string.match(regex))] );

  //       // console.log('res', result);

  //       })
  //     };

  //     for (let i = 0; i < stringForSearchArr.length; i++) {
  //       buildPredict(value, stringForSearchArr[i])
  //     }

  //     // const res = await locations.filter(loc => loc.name.toLowerCase().includes(value.toLowerCase()) || loc.address.city.toLowerCase().includes(value.toLowerCase()) );
  //     // const result = res.slice(0, 10);
  //     // setPredictions(result);
  //   }
  //   if(!value) {
  //     setPredictions([])
  //     setSearchSelected(null)
  //   }
  // };

  console.log("predictions", predictions);

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

import { useContext, useState } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
// Context
import { Context } from '../context/Context';
import Highlighter from 'react-highlight-words';
import { IonIcon, IonItem, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { informationCircle } from 'ionicons/icons';
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables';

const Search = () => {
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locations);

  const { segment, searchViewport, setListResults, setSearchSelected, searchText, setSearchText } =
    useContext(Context);

  const [predictions, setPredictions] = useState([]);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });
  const [searchWords, setSearchWords] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSearchText('');
    if (e.target.elements[0].value.length > 3 && segment === 'map') {
      dispatch(appActions.setIsLoading(true));
      try {
        const uri = encodeURI(e.target.elements[0].value);
        const res = await fetch(`${GOOGLE_API_URL}${uri}${GOOGLE_API_URL_CONFIG}`);
        const { results } = await res.json();

        if (results[0].geometry.location) {
          // center + zoom when user confirms his own typed in city or address (not choose from predictions)
          dispatch(
            mapActions.setCenter({
              lat: results[0].geometry.location.lat,
              lng: results[0].geometry.location.lng,
            })
          );
          dispatch(mapActions.setZoom(12));
        }
      } catch (error) {
        dispatch(
          appActions.setError(
            'Ups, schief gelaufen. Nur Orte in Deutschland, Österreich und der Schweiz möglich'
          )
        );
        setTimeout(() => dispatch(appActions.resetError()), 5000);
      }
      searchViewport();
      setPredictions([]);
      setListResults([]);
      dispatch(appActions.setIsLoading(false));
    }
  };

  const forAutocompleteChange = async (value) => {
    if (value.length >= 3 && locations) {
      // make array from input string -> each item is created after one space " "
      const searchQuery = value.split(' ').filter((word) => word);
      const res = await locations.filter((loc) => {
        const found = searchQuery.map((word) => {
          // return if exists just a space or a space and then nothing
          if (word === ' ' || word === '') return;
          // explanation: http://stackoverflow.com/a/18622606/1147859
          const reg = '(' + word + ')(?![^<]*>|[^<>]*</)';
          // i means case-insensitive mode
          const regex = new RegExp(reg, 'i');
          return regex.test(
            `${loc.name} ${loc.address.street} ${loc.address.number} ${loc.address.city}`
          );
        });
        // found is array with as many items as there are search words
        // if every item is true, than this location is returned
        if (found.every((v) => v === true)) return loc;
      });
      const result = res.slice(0, 4);
      setPredictions(result);
      // if user is on map list page and uses search than resultsList is displayed
      if (segment === 'list') setListResults(res);
    }
    if (!value) {
      setPredictions([]);
      setListResults([]);
      setSearchSelected(null);
    }
  };

  const initMarker = (loc) => {
    setSearchSelected(loc);
    setPredictions([]);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='d-flex align-items-center'>
        <IonSearchbar
          className='searchbar'
          type='search'
          inputMode='search'
          placeholder='Eisladen oder Stadt suchen'
          showCancelButton='always'
          showClearButton='always'
          cancel-button-text=''
          value={searchText}
          debounce={500}
          onIonChange={(e) => {
            setSearchText(e.detail.value);
            forAutocompleteChange(e.detail.value);
            setSearchWords(() => e.detail.value.split(' ').filter((word) => word));
          }}
        />
        <div>
          <IonIcon
            className='infoIcon me-2'
            color='primary'
            button
            onClick={(e) => {
              e.persist();
              setPopoverShow({ show: true, event: e });
            }}
            icon={informationCircle}
          />
          <IonPopover
            color='primary'
            cssClass='info-popover'
            event={popoverShow.event}
            isOpen={popoverShow.show}
            onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
          >
            Nichts gefunden? Trage den Eisladen auf der Karte ein.
          </IonPopover>
        </div>
      </div>
      {predictions && segment === 'map' ? (
        <IonList className='py-0'>
          {predictions.map((loc) => (
            <IonItem
              key={loc._id}
              button
              onClick={() => {
                setSearchText(
                  `${loc.name}, ${loc.address.street} ${loc.address.number}, ${loc.address.city}`
                );
                initMarker(loc);
              }}
              lines='full'
            >
              <Highlighter
                className='hightlighter-wrapper'
                activeIndex={-1}
                highlightClassName='highlight'
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={`${loc.name}, ${loc.address.street} ${loc.address.number} in ${loc.address.city}`}
              />
            </IonItem>
          ))}
        </IonList>
      ) : null}
    </form>
  );
};

export default Search;

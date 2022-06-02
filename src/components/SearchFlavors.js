import { useState, useEffect } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { flavorActions } from '../store/flavorSlice';
import { appActions } from '../store/appSlice';
// Context
import Highlighter from 'react-highlight-words';
import { IonIcon, IonItem, IonList, IonPopover, IonSearchbar } from '@ionic/react';
import { iceCream, informationCircle } from 'ionicons/icons';
import LoadingError from '../components/LoadingError';

const SearchFlavors = () => {
  const dispatch = useAppDispatch();
  const { flavor, searchTermFlavor } = useAppSelector((state) => state.flavor);

  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });
  const [flavors, setFlavors] = useState([]);
  const [searchWords, setSearchWords] = useState([]);
  const [flavorsPredict, setFlavorsPredict] = useState([]);

  useEffect(() => {
    dispatch(appActions.setIsLoading(true));
    const fetchFlavors = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/flavors`);
        const data = await res.json();
        setFlavors(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchFlavors();
    dispatch(appActions.setIsLoading(false));
  }, [dispatch]);

  const handleSearchTextChange = (value) => {
    if (!flavors) return;
    if (value.length < 3) {
      setFlavorsPredict([]);
      return;
    }

    const searchTerms = value.split(/\s/).filter(Boolean); // create array of search terms, remove all whitespaces
    const filteredFlavors = flavors.filter((flavor) => {
      const text = `${flavor.name}`.toLowerCase();
      return searchTerms.every((searchTerm) => text.includes(searchTerm.toLowerCase()));
    });
    setFlavorsPredict(filteredFlavors.slice(0, 8));
  };

  return (
    <>
      <div
        className='d-flex align-items-center pt-2'
        style={{ backgroundColor: 'var(--ion-item-background)' }}
      >
        <IonSearchbar
          className='searchbar'
          type='search'
          inputMode='text'
          placeholder='Name Eissorte eintippen'
          showCancelButton='always'
          showClearButton='always'
          searchIcon={iceCream}
          cancel-button-text=''
          spellcheck={true}
          autocorrect='on'
          value={searchTermFlavor}
          debounce={100}
          onIonChange={(e) => {
            dispatch(flavorActions.setSearchTermFlavor(e.detail.value));
            handleSearchTextChange(e.detail.value);
            setSearchWords(() => e.detail.value.split(' ').filter((word) => word));
          }}
          onIonCancel={() => dispatch(flavorActions.setFlavor(null))}
          onIonClear={() => dispatch(flavorActions.setFlavor(null))}
          onKeyUp={(e) => e.key === 'Enter' && setFlavorsPredict([])}
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
            Keine passenden Vorschläge? Tippe einfach den Namen der neuen Eissorte ein.
          </IonPopover>
        </div>
      </div>

      {flavorsPredict.length && searchTermFlavor !== flavor?.name ? (
        <IonList className='py-0'>
          <div className='infoText pt-2'>... Auswahl bereits eingetragener Sorten</div>
          {flavorsPredict.map((flavor) => (
            <IonItem
              key={flavor._id}
              button
              onClick={() => {
                dispatch(flavorActions.setFlavor(flavor));
                setFlavorsPredict([]);
                dispatch(flavorActions.setSearchTermFlavor(flavor.name));
              }}
              lines='full'
            >
              <Highlighter
                className='hightlighter-wrapper'
                activeIndex={-1}
                highlightClassName='highlight'
                searchWords={searchWords}
                caseSensitive={false}
                textToHighlight={`${flavor.name} ${flavor.type_fruit ? '• Sorbet' : ''} ${
                  flavor.type_cream ? '• Cremeeis' : ''
                }`}
              />
              <div
                className='flavor-search-preview'
                style={{
                  background: `linear-gradient(to bottom, ${flavor.color.primary}, ${
                    flavor.color.secondary ? flavor.color.secondary : flavor.color.primary
                  })`,
                }}
              ></div>
            </IonItem>
          ))}
        </IonList>
      ) : null}
      <LoadingError />
    </>
  );
};

export default SearchFlavors;

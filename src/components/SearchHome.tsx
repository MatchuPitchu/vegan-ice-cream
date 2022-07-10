import { useState, VFC } from 'react';
// Redux Store
import { useAppSelector } from '../store/hooks';
import SearchTopLocations from './TopLocations/SearchTopLocations';
import TopLocationsSlider from './TopLocations/TopLocationsSlider';
import NoTopLocation from './TopLocations/NoTopLocation';
import { IonToggle } from '@ionic/react';
import Search from './Search';
import EntdeckenList from './EntdeckenList';

type ToggleSearchbar = 'top-locations' | 'list-locations';

const SearchHome: VFC = () => {
  const { topLocationsInCity } = useAppSelector((state) => state.locations);

  const [toggleSearchbar, setToggleSearchbar] = useState<ToggleSearchbar>('list-locations');

  const [hideTopLocations, setHideTopLocations] = useState(true);
  const [noTopLocation, setNoTopLocation] = useState(false);
  const [cityName, setCityName] = useState<string>('');

  return (
    <>
      <div className='container-content'>
        <div className='searchbar-toggle'>
          <p className='searchbar-toggle__text'>Eisladen/Stadt</p>
          <IonToggle
            className='searchbar-toggle__toggle'
            checked={toggleSearchbar === 'top-locations'}
            onIonChange={(_) =>
              setToggleSearchbar((prev) =>
                prev === 'list-locations' ? 'top-locations' : 'list-locations'
              )
            }
          />
          <p className='searchbar-toggle__text'>Top Eisläden in Stadt</p>
        </div>
        {toggleSearchbar === 'top-locations' && (
          <SearchTopLocations
            setHideTopLocations={setHideTopLocations}
            setNoTopLocation={setNoTopLocation}
            noTopLocation={noTopLocation}
            setCityName={setCityName}
          />
        )}
        {toggleSearchbar === 'list-locations' && <Search showSuggestions={false} />}
      </div>

      {toggleSearchbar === 'top-locations' && (
        <>
          {noTopLocation && <NoTopLocation cityName={cityName} />}

          {topLocationsInCity.length > 0 && (
            <TopLocationsSlider
              topLocationsInCity={topLocationsInCity}
              hideTopLocations={hideTopLocations}
            />
          )}
        </>
      )}

      {toggleSearchbar === 'list-locations' && (
        <div className='container-content'>
          <EntdeckenList />
        </div>
      )}
    </>
  );
};

export default SearchHome;

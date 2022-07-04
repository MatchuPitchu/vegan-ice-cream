import { useState, VFC } from 'react';
// Redux Store
import { useAppSelector } from '../../store/hooks';
import SearchTopLocations from './SearchTopLocations';
import TopLocationsSlider from './TopLocationsSlider';
import NoTopLocation from './NoTopLocation';

const TopLocationsInCity: VFC = () => {
  const { topLocationsInCity } = useAppSelector((state) => state.locations);

  const [hideTopLocations, setHideTopLocations] = useState(true);
  const [noTopLocation, setNoTopLocation] = useState(false);
  const [cityName, setCityName] = useState<string>('');

  return (
    <>
      <SearchTopLocations
        setHideTopLocations={setHideTopLocations}
        setNoTopLocation={setNoTopLocation}
        noTopLocation={noTopLocation}
        setCityName={setCityName}
      />

      {noTopLocation && <NoTopLocation cityName={cityName} />}

      {topLocationsInCity.length !== 0 && (
        <TopLocationsSlider
          topLocationsInCity={topLocationsInCity}
          hideTopLocations={hideTopLocations}
        />
      )}
    </>
  );
};

export default TopLocationsInCity;

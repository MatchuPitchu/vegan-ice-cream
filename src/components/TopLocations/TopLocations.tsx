import { useState, VFC } from 'react';
import type { IceCreamLocation } from '../../types';
import SearchTopLocations from './SearchTopLocations';
import TopLocationsSlider from './TopLocationsSlider';
import NoTopLocation from './NoTopLocation';

const TopLocations: VFC = () => {
  const [topLocations, setTopLocations] = useState<IceCreamLocation[]>([]);
  const [hideTopLocations, setHideTopLocations] = useState(true);
  const [noTopLocation, setNoTopLocation] = useState(false);
  const [cityName, setCityName] = useState<string>('');

  return (
    <>
      <SearchTopLocations
        setTopLocations={setTopLocations}
        setHideTopLocations={setHideTopLocations}
        setNoTopLocation={setNoTopLocation}
        noTopLocation={noTopLocation}
        setCityName={setCityName}
      />
      {topLocations.length !== 0 && (
        <TopLocationsSlider topLocations={topLocations} hideTopLocations={hideTopLocations} />
      )}
      {noTopLocation && <NoTopLocation cityName={cityName} />}
    </>
  );
};

export default TopLocations;

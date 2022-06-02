import { useContext, VFC } from 'react';
import { Context } from '../../context/Context';
import SearchTopLocations from './SearchTopLocations';
import TopLocationsSlider from './TopLocationsSlider';
import NoTopLocation from './NoTopLocation';

interface Props {
  city: string;
}

const TopLocations: VFC<Props> = () => {
  const { noTopLocation, topLocations } = useContext(Context);

  return (
    <>
      <SearchTopLocations />
      {topLocations.length !== 0 && <TopLocationsSlider />}
      {noTopLocation && <NoTopLocation />}
    </>
  );
};

export default TopLocations;

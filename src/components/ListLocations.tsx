import { useState } from 'react';
// Redux Store
import { useAppSelector } from '../store/hooks';
import { getSelectedLocation } from '../store/locationsSlice';
import { IonCard, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import LocationInfoModal from './LocationInfoModal';
import ListLocation from './ListLocation';

export const ListLocations = () => {
  const { locations, locationsSearchResultsList } = useAppSelector((state) => state.locations);
  const selectedLocation = useAppSelector(getSelectedLocation);

  const { searchResultState } = useAppSelector((state) => state.search);

  const [endIndexInLocationsList, setEndIndexInLocationsList] = useState(4);

  const loadMore = ({ target }: CustomEvent<void>) => {
    setEndIndexInLocationsList((prev) => prev + 4);
    (target as HTMLIonInfiniteScrollElement).complete();
  };

  const locationsCurrentlyInList = locations?.slice(0, endIndexInLocationsList);

  return (
    <>
      {/* searchbar empty -> no search results */}
      {searchResultState === 'init' &&
        locationsCurrentlyInList.map((location, index) => (
          <ListLocation key={location._id} location={location} number={index + 1} />
        ))}

      {/* searchbar is used */}
      {searchResultState === 'found' &&
        locationsSearchResultsList.map((location, index) => (
          <ListLocation key={location._id} location={location} number={index + 1} />
        ))}

      {/* searchbar is used -> no search results */}
      {searchResultState === 'no-found' && (
        <div className='container-content--center'>
          <IonCard className='card--no-search-result mt-4'>
            <div>Noch keine Eisläden</div>
            <div>
              zu deiner <span className='text--highlighted'>Suche</span> gefunden.
            </div>
          </IonCard>
        </div>
      )}

      {selectedLocation && <LocationInfoModal selectedLocation={selectedLocation} />}

      {/* Infinite Scroll Ionic React: https://dev.to/daviddalbusco/infinite-scroll-with-ionic-react-3a3i */}
      {locationsSearchResultsList.length === 0 && (
        <IonInfiniteScroll onIonInfinite={loadMore} threshold='10%'>
          <IonInfiniteScrollContent loadingSpinner='dots' />
        </IonInfiniteScroll>
      )}
    </>
  );
};

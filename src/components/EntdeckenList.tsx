import { useState } from 'react';
// Redux Store
import { useAppSelector } from '../store/hooks';
import { getSelectedLocation } from '../store/locationsSlice';
import { IonCard, IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import LocationInfoModal from './LocationInfoModal';
import ListResultComponent from './ListResultComponent';
import ListFilters from './ListFilters';

const ListMap = () => {
  const { locations, locationsSearchResultsList } = useAppSelector((state) => state.locations);
  const selectedLocation = useAppSelector(getSelectedLocation);

  const { searchText } = useAppSelector((state) => state.search);

  const [endIndexInLocationsList, setEndIndexInLocationsList] = useState(4);

  const loadMore = ({ target }: CustomEvent<void>) => {
    setEndIndexInLocationsList((prev) => prev + 4);
    (target as HTMLIonInfiniteScrollElement).complete();
  };

  return (
    <IonContent>
      <ListFilters />

      {/* if searchbar is used */}
      {locationsSearchResultsList.length !== 0 &&
        locationsSearchResultsList.map((location) => (
          <ListResultComponent key={location._id} location={location} />
        ))}

      {/* if searchbar empty and so no search results */}
      {!searchText &&
        locationsSearchResultsList.length === 0 &&
        locations
          ?.slice(0, endIndexInLocationsList)
          .map((location) => <ListResultComponent key={location._id} location={location} />)}

      {/* if searchbar is used, but not results */}
      {searchText && locationsSearchResultsList.length === 0 && (
        <div className='container-content--center'>
          <IonCard>
            <div className='noTopLocCard'>
              Noch keine Eisläden
              <br />
              in <span className='highlightSpan'>{searchText}</span> gefunden.
              <br />
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
    </IonContent>
  );
};

export default ListMap;

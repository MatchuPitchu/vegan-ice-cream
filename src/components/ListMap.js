import { useState } from 'react';
// Redux Store
import { useAppSelector } from '../store/hooks';
import { IonCard, IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import SelectedMarker from './SelectedMarker';
import ListResultComponent from './ListResultComponent';
import ListFilters from './ListFilters';

const ListMap = () => {
  const { selectedLocation } = useAppSelector((state) => state.selectedLocation);
  const { locations, locationsSearchResultsList } = useAppSelector((state) => state.locations);
  const { searchText } = useAppSelector((state) => state.search);

  const [endIndexInLocationsList, setEndIndexInLocationsList] = useState(4);

  const loadMore = ({ target }) => {
    setEndIndexInLocationsList((prev) => prev + 4);
    target.complete();
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
        <div className='container text-center'>
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

      {selectedLocation && <SelectedMarker />}

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

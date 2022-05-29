// Redux Store
import { useAppSelector } from '../store/hooks';
// Context
import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { IonCard, IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import SelectedMarker from './SelectedMarker';
import ListResultComponent from './ListResultComponent';
import ListFilters from './ListFilters';

const ListMap = () => {
  const { selectedLocation } = useAppSelector((state) => state.selectedLocation);
  const { locations } = useAppSelector((state) => state.locations);
  const { searchText } = useAppSelector((state) => state.search);

  const { listResults } = useContext(Context);

  const [endIndexInLocationsList, setEndIndexInLocationsList] = useState(4);

  const loadMore = ({ target }) => {
    setEndIndexInLocationsList((prev) => prev + 4);
    target.complete();
  };

  return (
    <IonContent>
      <ListFilters />

      {/* if searchbar is used */}
      {listResults.length
        ? listResults?.map((loc) => <ListResultComponent key={loc._id} loc={loc} />)
        : null}

      {/* if searchbar empty and so listResults array is empty */}
      {!searchText && !listResults.length
        ? locations
            ?.slice(0, endIndexInLocationsList)
            .map((loc) => <ListResultComponent key={loc._id} loc={loc} />)
        : null}

      {/* if smth was typed into searchbar but no results were found  */}
      {searchText && !listResults.length ? (
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
      ) : null}

      {selectedLocation ? <SelectedMarker /> : null}

      {/* Infinite Scroll Ionic React: https://dev.to/daviddalbusco/infinite-scroll-with-ionic-react-3a3i */}
      {!listResults.length && (
        <IonInfiniteScroll onIonInfinite={loadMore} threshold='10%'>
          <IonInfiniteScrollContent loadingSpinner='dots' />
        </IonInfiniteScroll>
      )}
    </IonContent>
  );
};

export default ListMap;

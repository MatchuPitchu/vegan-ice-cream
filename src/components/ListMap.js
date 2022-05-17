// Redux Store
import { useAppSelector } from '../store/hooks';
// Context
import { useContext } from 'react';
import { Context } from '../context/Context';
import { IonCard, IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import SelectedMarker from './SelectedMarker';
import ListResultComponent from './ListResultComponent';

const ListMap = () => {
  const { selectedLocation } = useAppSelector((state) => state.selectedLocation);

  const { locationsList, listResults, disableInfScroll, loadMore, searchText } =
    useContext(Context);

  return (
    <IonContent>
      {/* <ListFilters /> */}

      {/* if searchbar is used */}
      {listResults.length
        ? listResults.map((loc) => <ListResultComponent key={loc._id} loc={loc} />)
        : null}

      {/* if searchbar empty and so listResults array is empty */}
      {!searchText && !listResults.length && locationsList
        ? locationsList.map((loc) => <ListResultComponent key={loc._id} loc={loc} />)
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
        <IonInfiniteScroll
          threshold='10%'
          disabled={disableInfScroll}
          onIonInfinite={(e) => loadMore(e)}
        >
          <IonInfiniteScrollContent loadingSpinner='dots'></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      )}
    </IonContent>
  );
};

export default ListMap;

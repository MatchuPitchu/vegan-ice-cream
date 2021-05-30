import { useContext } from "react";
import { Context } from '../context/Context';
import { IonCard, IonCardContent, IonCardTitle, IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import SelectedMarker from './SelectedMarker';
import ListResultComponent from "./ListResultComponent";

const ListMap = () => {
  const {
    locationsList,
    listResults,
    disableInfScroll,
    loadMore,
    selected,
    searchText,
  } = useContext(Context);

  return (
    <IonContent>
      {listResults.length ? listResults.map(loc => (
        <ListResultComponent key={loc._id} loc={loc} />
      )) : null}

      {!searchText && !listResults.length && locationsList ? locationsList.map(loc => (
        <ListResultComponent key={loc._id} loc={loc} />
      )) : null}

      {searchText && !listResults.length ? (
        <div className="container text-center">
          <IonCard>
            <IonCardContent>
            <IonCardTitle className="mb-3">Nichts gefunden ...</IonCardTitle>
              Hilf mit, neue Eisläden auf der Karte einzutragen.
            </IonCardContent>
          </IonCard>
        </div>
      ) : null}

      {selected ? <SelectedMarker /> : null}

      {/* Infinite Scroll Ionic React: https://dev.to/daviddalbusco/infinite-scroll-with-ionic-react-3a3i */}
      {!listResults.length && (
        <IonInfiniteScroll threshold="20%" disabled={disableInfScroll} onIonInfinite={(e) => loadMore(e)}>
          <IonInfiniteScrollContent loadingSpinner="dots">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
      )}

    </IonContent>
  )
};

export default ListMap;

import { VFC } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { appActions, EntdeckenSegment } from '../store/appSlice';
import { searchActions } from '../store/searchSlice';
import { IonIcon, IonLabel, IonPage, IonSegment, IonSegmentButton } from '@ionic/react';
import { listCircle, map as mapIcon } from 'ionicons/icons';
import Search from '../components/Search';
import EntdeckenList from '../components/EntdeckenList';
import EntdeckenMap from '../components/EntdeckenMap';

const Entdecken: VFC = () => {
  const dispatch = useAppDispatch();
  const { entdeckenSegment } = useAppSelector((state) => state.app);

  return (
    <IonPage>
      {/* <div>
        <IonSegment
          onIonChange={({ detail: { value } }) => {
            dispatch(appActions.setEntdeckenSegment(value as EntdeckenSegment));
            dispatch(searchActions.setSearchText('')); // if segment is changed, then reset searchbar
          }}
          value={entdeckenSegment}
          swipe-gesture
          className='segments'
        >
          <IonSegmentButton className='segmentBtn' value='map' layout='icon-start'>
            <IonLabel>Karte</IonLabel>
            <IonIcon icon={mapIcon} />
          </IonSegmentButton>
          <IonSegmentButton className='segmentBtn' value='list' layout='icon-start'>
            <IonLabel>Liste</IonLabel>
            <IonIcon icon={listCircle} />
          </IonSegmentButton>
        </IonSegment>
      </div> */}

      <Search />

      <EntdeckenMap />
    </IonPage>
  );
};

export default Entdecken;

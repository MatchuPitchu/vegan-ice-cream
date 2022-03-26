import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { IonToggle, IonList, IonItem, IonLabel, IonIcon, IonCard, isPlatform } from '@ionic/react';
import { caretDownCircle, caretForwardCircle } from 'ionicons/icons';

const ListFilters = () => {
  const { locations, locationsList, setLocationsList, listResults, setListResults } =
    useContext(Context);

  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    rating_vegan_offer: false,
    rating_quality: false,
    cityDesc: false,
    storeDesc: false,
  });

  console.log('LOCATIONS', locations);
  console.log('LOCATIONSLIST', locationsList);
  console.log('LISTRESULTS', listResults);
  console.log('Filters', filters);

  const calcFilter = (filter) => {
    console.log(filter);
    setFilters((prev) => ({
      ...prev,
      ...filter,
    }));
    // filter functions for sorting reverse and normal
    const filterReverse = (compare) => {
      // setLocations(locations.sort(compare).reverse());
      setLocationsList(locationsList.sort(compare).reverse());
      setListResults(listResults.sort(compare).reverse());
    };

    // const filterNormal = (compare) => {
    //   // setLocations(locations.sort(compare).reverse());
    //   setLocationsList(locationsList.sort(compare).reverse());
    //   setListResults(listResults.sort(compare).reverse());
    // };

    if (filter.rating_vegan_offer) {
      console.log('TEST1');
      const compareVeganOffer = (a, b) => a.location_rating_quality - b.location_rating_quality;
      filterReverse(compareVeganOffer);
    }

    if (filter.rating_quality) {
      console.log('TEST2');
      const compareQuality = (a, b) =>
        a.location_rating_vegan_offer - b.location_rating_vegan_offer;
      filterReverse(compareQuality);
    }

    if (filter.cityDesc) {
      console.log('TEST3');
      const compareCity = (a, b) => {
        console.log(a.address.city, b.address.city);
        if (a.address.city < b.address.city) return -1;
        if (a.address.city > b.address.city) return 1;
        return 0;
      };
      filterReverse(compareCity);
    }

    if (filter.storeDesc) {
      console.log('TEST4');
      const compareStore = (a, b) => {
        console.log(a.name, b.name);
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      };
      const newArr = locationsList.sort(compareStore);
      console.log(newArr);
      setLocationsList(newArr);
    }
  };

  return (
    <IonCard className={`${isPlatform('desktop') ? 'cardIonic' : ''}`}>
      <IonItem
        className='itemTextSmall'
        lines={!showFilter ? 'none' : 'full'}
        detail={false}
        button
        onClick={() => setShowFilter((prev) => !prev)}
      >
        <IonLabel>Sortieren</IonLabel>
        <IonIcon size='small' icon={!showFilter ? caretForwardCircle : caretDownCircle} />
      </IonItem>

      {showFilter && (
        <IonList className='filterContainer'>
          <IonItem className='labelFilter' lines='none'>
            <IonLabel>Veganes Angebot (absteigend)</IonLabel>
            <IonToggle onIonChange={(e) => calcFilter({ rating_vegan_offer: e.detail.checked })} />
          </IonItem>

          <IonItem className='labelFilter' lines='none'>
            <IonLabel>Eis-Erlebnis (absteigend)</IonLabel>
            <IonToggle onIonChange={(e) => calcFilter({ rating_quality: e.detail.checked })} />
          </IonItem>

          <IonItem className='labelFilter' lines='none'>
            <IonLabel>Stadt (A-Z)</IonLabel>
            <IonToggle onIonChange={(e) => calcFilter({ cityDesc: e.detail.checked })} />
          </IonItem>

          <IonItem className='labelFilter' lines='none'>
            <IonLabel>Eisladen (A-Z)</IonLabel>
            <IonToggle onIonChange={(e) => calcFilter({ storeDesc: e.detail.checked })} />
          </IonItem>
        </IonList>
      )}
    </IonCard>
  );
};

export default ListFilters;

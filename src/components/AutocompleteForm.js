import { useContext } from 'react';
// Redux Store
import { useAppDispatch } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
// Context
import { Context } from '../context/Context';
import { Autocomplete } from '@react-google-maps/api';
import {
  IonButton,
  IonCardSubtitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
} from '@ionic/react';
import { checkbox, closeCircleOutline, informationCircleOutline } from 'ionicons/icons';
import LoadingError from './LoadingError';

const GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
// fetch results are restricted to countries DE, AT, CH, LI
const GOOGLE_API_URL_CONFIG = `&components=country:DE|country:AT|country:CH|country:LI&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

const AutocompleteForm = () => {
  const dispatch = useAppDispatch();

  const {
    locations,
    autocomplete,
    setAutocomplete,
    autocompleteModal,
    setAutocompleteModal,
    searchAutocomplete,
    setSearchAutocomplete,
    result,
    setResult,
    formattedAddress,
    setFormattedAddress,
    setNewLocation,
    setNewLocModal,
    enterAnimation,
    leaveAnimation,
  } = useContext(Context);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!result) return;
    dispatch(appActions.setIsLoading(true));

    const fetchData = async () => {
      try {
        const uri = encodeURI(formattedAddress || searchAutocomplete);
        const res = await fetch(`${GOOGLE_API_URL}${uri}${GOOGLE_API_URL_CONFIG}`);
        const { results } = await res.json();

        if (result.address.number) {
          setNewLocation({
            ...result,
            address: {
              ...result.address,
              geo: {
                lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
                lng: results[0].geometry.location ? results[0].geometry.location.lng : null,
              },
            },
          });
        } else {
          let address = {};
          results[0].address_components &&
            results[0].address_components.forEach((e) =>
              e.types.forEach((type) => Object.assign(address, { [type]: e.long_name }))
            );
          setNewLocation({
            name: '',
            address: {
              street: address.route ? address.route : '',
              number: address.street_number ? parseInt(address.street_number) : '',
              zipcode: address.postal_code ? address.postal_code : '',
              city: address.locality ? address.locality : '',
              country: address.country ? address.country : '',
              geo: {
                lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
                lng: results[0].geometry.location ? results[0].geometry.location.lng : null,
              },
            },
            location_url: '',
            place_id: address.place_id ? address.place_id : '',
          });
        }

        if (results[0].geometry.location) {
          dispatch(
            mapActions.setCenter({
              lat: results[0].geometry.location.lat,
              lng: results[0].geometry.location.lng,
            })
          );
          dispatch(mapActions.setZoom(18));
        }
      } catch (error) {
        dispatch(
          appActions.setError(
            'Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in D, AUT, CH und LIE eintragen.'
          )
        );
        setTimeout(() => dispatch(appActions.setError('')), 5000);
      }
    };

    const duplicate = locations.find(
      ({ address: { street, number } }) =>
        street === result.address.street && number === result.address.number
    );
    if (duplicate) {
      setResult(null);
      dispatch(appActions.setError('Adresse gibt es schon'));
      setTimeout(() => dispatch(appActions.setError('')), 5000);
    } else {
      fetchData();
      dispatch(
        appActions.setCheckMsgNewLocation('Bestätige noch die Daten - klicke auf das grüne Icon')
      );
    }

    dispatch(appActions.setIsLoading(false));
    setAutocompleteModal(false);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const data = autocomplete.getPlace();
      const address = {};
      data?.address_components?.map((item) =>
        item.types.map((type) => Object.assign(address, { [type]: item.long_name }))
      );
      setFormattedAddress(data.formatted_address);
      setResult({
        name: data.name ? data.name : '',
        address: {
          street: address.route ? address.route : '',
          number: address.street_number ? +address.street_number : '',
          zipcode: address.postal_code ? address.postal_code : '',
          city: address.locality ? address.locality : '',
          country: address.country ? address.country : '',
          geo: {
            lat: null,
            lng: null,
          },
        },
        location_url: data.website ? data.website : '',
        place_id: data.place_id ? data.place_id : '',
      });
    } else {
      dispatch(appActions.setError('Autocomplete kann gerade nicht geladen werden'));
      setTimeout(() => dispatch(appActions.setError('')), 5000);
    }
  };

  const onAutocompleteLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  return (
    <IonModal
      cssClass='newLocModal'
      isOpen={autocompleteModal}
      swipeToClose={true}
      backdropDismiss={true}
      onDidDismiss={() => setNewLocModal(false)}
      enterAnimation={enterAnimation}
      leaveAnimation={leaveAnimation}
    >
      <IonItem lines='full'>
        <IonLabel>Eisladen eintragen</IonLabel>
        <IonButton
          fill='clear'
          onClick={() => {
            setAutocompleteModal(false);
            setNewLocation(null);
          }}
        >
          <IonIcon icon={closeCircleOutline} />
        </IonButton>
      </IonItem>
      <IonContent>
        <form className='d-flex flex-column' onSubmit={onSubmit}>
          <IonItem className='mt-3 px-2 addLocForm' lines='none'>
            <div className='ion-text-wrap' position='stacked'>
              <IonCardSubtitle color='primary' className='mb-1'>
                Welchen Eisladen hast du entdeckt?
              </IonCardSubtitle>
              <p style={{ fontSize: '0.8rem' }}>
                <IonIcon size='small' icon={informationCircleOutline} /> Name und Stadt reichen
                zumeist. Sonst trage die korrekte Adresse ein. Deutschland, Schweiz, Österreich und
                Liechtenstein sind aktuell verfügbar.
              </p>
            </div>
          </IonItem>
          <IonItem className='addLocForm' lines='none'>
            <Autocomplete
              className='container-autocomplete'
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
              restrictions={{ country: ['de', 'at', 'ch', 'li'] }} // Restricts autocomplete to countries DE, AT, CH, LI
              fields={['name', 'address_components', 'formatted_address', 'place_id', 'website']}
            >
              <input
                type='text'
                placeholder='Name, Adresse eintippen ...'
                className='search-autocomplete'
                // value={searchText}
                onChange={(e) => {
                  setSearchAutocomplete(e.target.value);
                  setFormattedAddress(''); // reset formattedAddress if input is filled manually
                }}
              />
            </Autocomplete>
          </IonItem>
          <IonButton fill='solid' className='check-btn my-3' type='submit'>
            <IonIcon className='me-1' icon={checkbox} />
            Checke deine Eingabe
          </IonButton>
        </form>
      </IonContent>

      <LoadingError />
    </IonModal>
  );
};

export default AutocompleteForm;

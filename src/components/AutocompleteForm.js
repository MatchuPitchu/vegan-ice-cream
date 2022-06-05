import { useContext, useState } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { locationsActions } from '../store/locationsSlice';
// Context
import { Context } from '../context/Context';
import { useAnimation } from '../hooks/useAnimation';
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
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables';

const AutocompleteForm = () => {
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locations);
  const { showAddNewLocationModal } = useAppSelector((state) => state.app);

  const [googleAutocomplete, setGoogleAutocomplete] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationWebsite, setLocationWebsite] = useState('');

  const { enterAnimationFromBottom, leaveAnimationToBottom } = useAnimation();

  const { setNewLocModal } = useContext(Context);

  const searchForDuplicate = (geoCodingResult) => {
    const fetchedStreet =
      geoCodingResult.address_components[1].types[0] === 'route' &&
      geoCodingResult.address_components[1].long_name;
    const fetchedNumber =
      geoCodingResult.address_components[0].types[0] === 'street_number' &&
      geoCodingResult.address_components[0].long_name;
    return locations.some(
      ({ address: { street, number } }) => street === fetchedStreet && number === +fetchedNumber
    );
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(appActions.setIsLoading(true));

    try {
      const uri = encodeURI(searchText);
      const response = await fetch(`${GOOGLE_API_URL}${uri}${GOOGLE_API_URL_CONFIG}`);
      const {
        results: [geoCodingResult],
      } = await response.json();

      const isDuplicate = searchForDuplicate(geoCodingResult);

      if (isDuplicate) {
        dispatch(appActions.setError('Adresse gibt es schon'));
        setTimeout(() => dispatch(appActions.resetError()), 5000);
      }

      if (!isDuplicate) {
        dispatch(
          locationsActions.setNewLocation({
            name: locationName,
            address_components: geoCodingResult.address_components,
            geo: geoCodingResult.geometry.location,
            location_url: locationWebsite,
            place_id: geoCodingResult.place_id,
          })
        );

        if (geoCodingResult.geometry.location) {
          dispatch(
            mapActions.setCenter({
              lat: geoCodingResult.geometry.location.lat,
              lng: geoCodingResult.geometry.location.lng,
            })
          );
          dispatch(mapActions.setZoom(15));
        }

        dispatch(
          appActions.setCheckMsgNewLocation('Bestätige noch die Daten - klicke auf das grüne Icon')
        );
      }
    } catch (error) {
      dispatch(
        appActions.setError(
          'Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in D, AUT, CH und LIE eintragen.'
        )
      );
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }

    dispatch(appActions.setIsLoading(false));
    dispatch(appActions.setShowAddNewLocationModal(false));
  };

  const handleSelectPlace = () => {
    if (googleAutocomplete === null) return;
    const data = googleAutocomplete.getPlace();

    setSearchText(data.formatted_address);
    // unique received data from google autocomplete: name, website
    setLocationName(data.name || '');
    setLocationWebsite(data.website || '');
  };

  const handleAutocompleteLoad = (autocomplete) => setGoogleAutocomplete(autocomplete);

  return (
    <IonModal
      cssClass='newLocModal'
      isOpen={showAddNewLocationModal}
      swipeToClose={true}
      backdropDismiss={true}
      onDidDismiss={() => setNewLocModal(false)}
      enterAnimation={enterAnimationFromBottom}
      leaveAnimation={leaveAnimationToBottom}
    >
      <IonItem lines='full'>
        <IonLabel>Eisladen eintragen</IonLabel>
        <IonButton
          fill='clear'
          onClick={() => {
            dispatch(locationsActions.resetNewLocation());
            dispatch(appActions.setShowAddNewLocationModal(false));
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
              onLoad={handleAutocompleteLoad}
              onPlaceChanged={handleSelectPlace}
              restrictions={{ country: ['de', 'at', 'ch', 'li'] }} // Restricts autocomplete to countries DE, AT, CH, LI
              fields={['name', 'address_components', 'formatted_address', 'place_id', 'website']}
            >
              <input
                type='text'
                placeholder='Name, Adresse eintippen ...'
                className='search-autocomplete'
                onChange={({ target: { value } }) => setSearchText(value)}
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

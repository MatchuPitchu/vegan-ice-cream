import { FormEvent, useCallback, useState, VFC } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { locationsActions } from '../store/locationsSlice';
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
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables-and-functions';
import { showActions } from '../store/showSlice';

type AutocompleteGoogle = google.maps.places.Autocomplete;

const AutocompleteForm: VFC = () => {
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locations);
  const { showSearchNewLocationModal } = useAppSelector((state) => state.show);

  const [googleAutocomplete, setGoogleAutocomplete] = useState<AutocompleteGoogle>();
  const [searchText, setSearchText] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationWebsite, setLocationWebsite] = useState('');

  const { enterAnimationFromBottom, leaveAnimationToBottom } = useAnimation();

  const searchForDuplicate = useCallback(
    (geoCodingResult) => {
      const fetchedStreet =
        geoCodingResult.address_components[1].types[0] === 'route' &&
        geoCodingResult.address_components[1].long_name;
      const fetchedNumber =
        geoCodingResult.address_components[0].types[0] === 'street_number' &&
        geoCodingResult.address_components[0].long_name;
      return locations.some(
        ({ address: { street, number } }) => street === fetchedStreet && number === +fetchedNumber
      );
    },
    [locations]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    dispatch(showActions.setShowSearchNewLocationModal(false));
  };

  const handleSelectPlace = () => {
    if (!googleAutocomplete) return;
    const data = googleAutocomplete.getPlace();

    console.log(data);

    // setSearchText(data.formatted_address);
    // unique received data from google autocomplete: name, website
    // setLocationName(data.name || '');
    // setLocationWebsite(data.website || '');
  };

  const handleAutocompleteLoad = (autocomplete: AutocompleteGoogle) =>
    setGoogleAutocomplete(autocomplete);

  return (
    <IonModal
      cssClass='new-location-modal'
      isOpen={showSearchNewLocationModal}
      swipeToClose={true}
      backdropDismiss={true}
      onDidDismiss={() => dispatch(showActions.setShowSearchNewLocationModal(false))}
      enterAnimation={enterAnimationFromBottom}
      leaveAnimation={leaveAnimationToBottom}
    >
      <IonItem lines='full'>
        <IonLabel>Eisladen eintragen</IonLabel>
        <IonButton
          fill='clear'
          onClick={() => {
            dispatch(locationsActions.resetNewLocation());
            dispatch(showActions.setShowSearchNewLocationModal(false));
          }}
        >
          <IonIcon icon={closeCircleOutline} />
        </IonButton>
      </IonItem>
      <IonContent>
        <form className='d-flex flex-column' onSubmit={onSubmit}>
          <IonItem className='mt-3 px-2 addLocForm' lines='none'>
            <div className='ion-text-wrap'>
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
              restrictions={{ country: ['de', 'at', 'ch', 'li'] }}
              fields={[
                'name',
                'adr_address',
                'address_components',
                'formatted_address',
                'geometry',
                'place_id',
                'website',
              ]}
            >
              <input
                type='text'
                placeholder='Name, Adresse eintippen ...'
                className='search-autocomplete'
                onChange={({ target: { value } }) => setSearchText(value)}
              />
            </Autocomplete>
          </IonItem>
          <IonButton fill='clear' className='button--check my-3' type='submit'>
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

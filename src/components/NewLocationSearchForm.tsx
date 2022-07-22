import { FormEvent, useState, VFC } from 'react';
import type { IceCreamLocation, PopoverState } from '../types/types';
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../utils/variables-and-functions';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { locationsActions } from '../store/locationsSlice';
import { showActions } from '../store/showSlice';
import { useAnimation } from '../hooks/useAnimation';
import { Autocomplete } from '@react-google-maps/api';
import {
  IonButton,
  IonCard,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPopover,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { SubmitHandler, useForm } from 'react-hook-form';

type AutocompleteGoogle = google.maps.places.Autocomplete;

type AddressComponentType = { types: string[]; long_name: string };

const isNewLocationDuplicate = (
  locations: IceCreamLocation[],
  streetNumber: AddressComponentType,
  streetName: AddressComponentType
) => {
  const fetchedNumber = streetNumber.types[0] === 'street_number' && +streetNumber.long_name;
  const fetchedStreet = streetName.types[0] === 'route' && streetName.long_name;
  return locations.some(
    ({ address: { street, number } }) => street === fetchedStreet && number === fetchedNumber
  );
};

interface SearchFormValues {
  address: string;
}

const defaultSearchFormValues: SearchFormValues = { address: '' };

const NewLocationSearchForm: VFC = () => {
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.locations);
  const { showSearchNewLocationModal } = useAppSelector((state) => state.show);

  const [googleAutocomplete, setGoogleAutocomplete] = useState<AutocompleteGoogle>();
  const [searchText, setSearchText] = useState('');
  const [locationData, setLocationData] = useState({ name: '', website: '' });

  const [showPopoverInfo, setShowPopoverInfo] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });

  const { enterAnimationFromBottom, leaveAnimationToBottom } = useAnimation();

  const { handleSubmit, register, reset } = useForm({ defaultValues: defaultSearchFormValues });

  const onSubmit: SubmitHandler<SearchFormValues> = async () => {
    dispatch(appActions.setIsLoading(true));

    try {
      const uri = encodeURI(searchText);
      const response = await fetch(`${GOOGLE_API_URL}${uri}${GOOGLE_API_URL_CONFIG}`);

      const {
        results: [geoCodingResult],
      } = await response.json();

      const { address_components, geometry, place_id } = geoCodingResult;

      const isDuplicate = isNewLocationDuplicate(
        locations,
        address_components[0],
        address_components[1]
      );

      if (isDuplicate) {
        dispatch(appActions.setError('Adresse gibt es schon'));
        setTimeout(() => dispatch(appActions.resetError()), 5000);
      }

      if (!isDuplicate) {
        dispatch(
          locationsActions.setNewLocation({
            name: locationData.name,
            address_components: address_components,
            geo: geometry.location,
            location_url: locationData.website,
            place_id: place_id,
          })
        );

        if (geometry.location) {
          dispatch(
            mapActions.setCenter({
              lat: geometry.location.lat,
              lng: geometry.location.lng,
            })
          );
          dispatch(mapActions.setZoom(15));
        }

        dispatch(
          appActions.setConfirmMessageNewLocation(
            'Bestätige noch die Daten - klicke auf das grüne Icon'
          )
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
    reset();
    setLocationData({ name: '', website: '' });
    dispatch(showActions.setShowSearchNewLocationModal(false));
  };

  const handleSelectPlace = () => {
    if (!googleAutocomplete) return;
    const { formatted_address, name, website } = googleAutocomplete.getPlace();
    if (formatted_address) {
      setSearchText(formatted_address!);
      // google autocomplete data that is not available with other Google Maps API: name, website
      setLocationData({ name: name || '', website: website || '' });
    }
  };

  const handleAutocompleteLoad = (autocomplete: AutocompleteGoogle) =>
    setGoogleAutocomplete(autocomplete);

  return (
    <IonModal
      cssClass='modal'
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
        <form className='container-content mt-3' onSubmit={handleSubmit(onSubmit)}>
          <IonCard>
            <IonItem lines='none' className='item--small item-text--small item--transparent'>
              <IonLabel className='ion-text-wrap'>Welchen Eisladen hast du entdeckt?</IonLabel>
              <IonIcon
                className='info-icon'
                color='primary'
                slot='end'
                icon={informationCircleOutline}
                onClick={(event) => {
                  event.persist();
                  setShowPopoverInfo({ showPopover: true, event });
                }}
              />
            </IonItem>

            <IonPopover
              cssClass='info-popover'
              event={showPopoverInfo.event}
              isOpen={showPopoverInfo.showPopover}
              onDidDismiss={() => setShowPopoverInfo({ showPopover: false, event: undefined })}
            >
              <div className='info-popover__content'>
                Name und Stadt reichen zumeist. Sonst trage die korrekte Adresse ein. Deutschland,
                Schweiz, Österreich und Liechtenstein sind aktuell verfügbar.
              </div>
            </IonPopover>

            <IonItem className='item--transparent' lines='none'>
              <Autocomplete
                className='container-autocomplete'
                onLoad={handleAutocompleteLoad}
                onPlaceChanged={handleSelectPlace}
                restrictions={{ country: ['de', 'at', 'ch', 'li'] }}
                fields={['name', 'address_components', 'formatted_address', 'place_id', 'website']}
              >
                <input
                  {...register('address')}
                  type='text'
                  placeholder='Name oder Adresse ...'
                  className='search-autocomplete'
                  onChange={({ target: { value } }) => setSearchText(value)}
                />
              </Autocomplete>
            </IonItem>
            <IonButton
              fill='clear'
              className='button--check button--check-large my-3 mx-5'
              type='submit'
              expand='block'
            >
              <IonIcon className='pe-1' icon={checkmarkCircleOutline} />
              Checke deine Eingabe
            </IonButton>
          </IonCard>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default NewLocationSearchForm;

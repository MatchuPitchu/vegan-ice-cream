// Redux Store
import { appActions } from '../store/appSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
// Context
import { useAnimation } from '../hooks/useAnimation';
import { Controller, useForm } from 'react-hook-form';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
} from '@ionic/react';
import { add, closeCircleOutline } from 'ionicons/icons';
import Error from './Error';
import LoadingError from './LoadingError';
import { showActions } from '../store/showSlice';

const NewLocationForm = () => {
  const dispatch = useAppDispatch();
  const { newLocation } = useAppSelector((state) => state.locations);
  const { showAddNewLocationForm } = useAppSelector((state) => state.show);

  const { enterAnimationFromBottom, leaveAnimationToBottom } = useAnimation();

  const defaultValues = {
    name: newLocation?.name || '',
    street: newLocation?.address.street || '',
    number: newLocation?.address.number || '',
    zipcode: newLocation?.address.zipcode || '',
    city: newLocation?.address.city || '',
    country: newLocation?.address.country || '',
    location_url: newLocation?.location_url || '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = async ({ name, street, number, zipcode, city, country, location_url }) => {
    dispatch(appActions.setIsLoading(true));
    try {
      const body = {
        name,
        address: {
          street,
          number,
          zipcode,
          city,
          country,
          geo: {
            lat: newLocation.address.geo.lat,
            lng: newLocation.address.geo.lng,
          },
        },
        location_url,
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/locations`, options);
      const newLocationObj = await res.json();
      dispatch(locationsActions.addToLocations(newLocationObj));
      if (!newLocationObj) {
        dispatch(appActions.setError('Fehler beim Eintragen. Bitte versuch es später nochmal.'));
        setTimeout(() => dispatch(appActions.resetError()), 5000);
      }
    } catch (error) {
      dispatch(appActions.setError(error.message));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    dispatch(locationsActions.resetNewLocation());
    dispatch(appActions.setIsLoading(false));
  };

  return (
    <IonModal
      cssClass='new-location-modal'
      isOpen={showAddNewLocationForm}
      swipeToClose={true}
      backdropDismiss={true}
      onDidDismiss={() => dispatch(showActions.setShowAddNewLocationForm(false))}
      enterAnimation={enterAnimationFromBottom}
      leaveAnimation={leaveAnimationToBottom}
    >
      <IonItem lines='full'>
        <IonLabel>Eisladen eintragen</IonLabel>
        <IonButton
          fill='clear'
          onClick={() => {
            dispatch(showActions.setShowAddNewLocationForm(false));
            dispatch(locationsActions.resetNewLocation());
          }}
        >
          <IonIcon icon={closeCircleOutline} />
        </IonButton>
      </IonItem>
      {newLocation ? (
        <IonContent className='ion-padding'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines='none' className='mb-1'>
              <IonLabel position='floating' htmlFor='name'>
                Name
              </IonLabel>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    inputmode='text'
                    value={value}
                    onIonChange={(e) => onChange(e.detail.value)}
                  />
                )}
                name='name'
                rules={{ required: true }}
              />
            </IonItem>
            {Error('name', errors)}

            <IonItem lines='none' className='mb-1'>
              <IonLabel position='floating' htmlFor='street'>
                Straße
              </IonLabel>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    type='text'
                    inputmode='text'
                    value={value}
                    onIonChange={(e) => onChange(e.detail.value)}
                  />
                )}
                name='street'
                rules={{ required: true }}
              />
            </IonItem>
            {Error('street', errors)}

            <IonItem lines='none' className='mb-1'>
              <IonLabel position='floating' htmlFor='number'>
                Nummer
              </IonLabel>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    type='number'
                    inputmode='numeric'
                    value={value}
                    onIonChange={(e) => onChange(e.detail.value)}
                  />
                )}
                name='number'
                rules={{
                  required: true,
                  maxLength: 3,
                  pattern: /^[0-9]+$/,
                }}
              />
            </IonItem>
            {Error('number', errors)}

            <IonItem lines='none' className='mb-1'>
              <IonLabel position='floating' htmlFor='zipcode'>
                PLZ
              </IonLabel>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    type='text'
                    inputmode='numeric'
                    value={value}
                    onIonChange={(e) => onChange(e.detail.value)}
                  />
                )}
                name='zipcode'
                rules={{
                  required: true,
                  maxLength: 5,
                  // Regex accepts only digits, min 4 and max 5 digits
                  pattern: /^[0-9]{4,5}$/,
                }}
              />
            </IonItem>
            {Error('zipcode', errors)}

            <IonItem lines='none' className='mb-1'>
              <IonLabel position='floating' htmlFor='city'>
                Stadt
              </IonLabel>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    type='text'
                    inputmode='text'
                    value={value}
                    onIonChange={(e) => onChange(e.detail.value)}
                  />
                )}
                name='city'
                rules={{ required: true }}
              />
            </IonItem>
            {Error('city', errors)}

            <IonItem lines='none' className='mb-1'>
              <IonLabel position='floating' htmlFor='country'>
                Land
              </IonLabel>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    type='text'
                    inputmode='text'
                    value={value}
                    onIonChange={(e) => onChange(e.detail.value)}
                  />
                )}
                name='country'
                rules={{ required: true }}
              />
            </IonItem>
            {Error('country', errors)}

            <IonItem lines='none' className='mb-1'>
              <IonLabel position='stacked' htmlFor='location_url'>
                Website Eisladen
              </IonLabel>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    type='text'
                    inputmode='url'
                    value={value}
                    onIonChange={(e) => onChange(e.detail.value)}
                    placeholder='http://'
                  />
                )}
                name='location_url'
              />
            </IonItem>
            {Error('location_url', errors)}

            <IonButton className='my-3 confirm-btn' type='submit' expand='block'>
              <IonIcon className='pe-1' icon={add} />
              Neu eintragen
            </IonButton>
          </form>
        </IonContent>
      ) : (
        <IonContent>Vielen Dank!</IonContent>
      )}

      <LoadingError />
    </IonModal>
  );
};

export default NewLocationForm;

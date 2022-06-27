import { VFC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
// Redux Store
import { appActions } from '../store/appSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { locationsActions } from '../store/locationsSlice';
import { showActions } from '../store/showSlice';
import { useAnimation } from '../hooks/useAnimation';
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonModal } from '@ionic/react';
import { add, closeCircleOutline } from 'ionicons/icons';
import { CustomInput } from './FormFields/CustomInput';
import Select from './FormFields/Select';

interface NewLocationFormValues {
  name: string;
  street: string;
  number: string;
  zipcode: string;
  city: string;
  country: string;
  location_url: string;
}

const NewLocationForm: VFC = () => {
  const dispatch = useAppDispatch();
  const { newLocation } = useAppSelector((state) => state.locations);
  const { showAddNewLocationForm } = useAppSelector((state) => state.show);

  const { enterAnimationFromBottom, leaveAnimationToBottom } = useAnimation();

  const defaultNewLocationFormValues: NewLocationFormValues = {
    name: newLocation?.name || '',
    street: newLocation?.address.street || '',
    number: String(newLocation?.address.number) || '',
    zipcode: newLocation?.address.zipcode || '',
    city: newLocation?.address.city || '',
    country: newLocation?.address.country || '',
    location_url: newLocation?.location_url || '',
  };

  const { control, handleSubmit } = useForm({ defaultValues: defaultNewLocationFormValues });

  const onSubmit: SubmitHandler<NewLocationFormValues> = async ({
    name,
    street,
    number,
    zipcode,
    city,
    country,
    location_url,
  }) => {
    dispatch(appActions.setIsLoading(true));
    try {
      const body = {
        name,
        address: {
          street,
          number: +number, // has to be converted before Sending to Backend
          zipcode,
          city,
          country,
          geo: {
            lat: newLocation!.address.geo.lat,
            lng: newLocation!.address.geo.lng,
          },
        },
        location_url,
      };

      const options: RequestInit = {
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
    } catch (err: any) {
      dispatch(appActions.setError(err.message));
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
      <IonContent className='ion-padding'>
        {newLocation ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines='none' className='mb-1'>
              <CustomInput
                control={control}
                name='name'
                label='Name'
                labelPosition='floating'
                rules={{ required: 'Bitte ergänze den Namen' }}
              />
            </IonItem>
            <IonItem lines='none' className='mb-1'>
              <CustomInput
                control={control}
                name='street'
                label='Straße'
                labelPosition='floating'
                rules={{ required: 'Bitte ergänze die Straße' }}
              />
            </IonItem>
            <IonItem lines='none' className='mb-1'>
              <CustomInput
                control={control}
                name='number'
                label='Nummer'
                labelPosition='floating'
                rules={{
                  required: 'Bitte ergänze die Nummer',
                  maxLength: 3,
                  pattern: /^\d{1,3}$/,
                }}
                type='text'
                inputmode='numeric'
              />
            </IonItem>
            <IonItem lines='none' className='mb-1'>
              <CustomInput
                control={control}
                name='zipcode'
                label='PLZ'
                labelPosition='floating'
                rules={{
                  required: 'Bitte ergänze die PLZ',
                  maxLength: 5,
                  pattern: /^\d{4,5}$/,
                }}
                maxlength={5}
                type='text'
                inputmode='numeric'
              />
            </IonItem>
            <IonItem lines='none' className='mb-1'>
              <CustomInput
                control={control}
                name='city'
                label='Stadt'
                labelPosition='floating'
                rules={{ required: 'Bitte ergänze die Straße' }}
              />
            </IonItem>
            <IonItem lines='none' className='mb-1'>
              <Select
                control={control}
                name='country'
                label='Land'
                labelPosition='floating'
                rules={{ required: 'Bitte wähle ein Land' }}
                options={[
                  { value: 'Deutschland', label: 'Deutschland' },
                  { value: 'Österreich', label: 'Österreich' },
                  { value: 'Schweiz', label: 'Schweiz' },
                  { value: 'Liechtenstein', label: 'Liechtenstein' },
                ]}
              />
            </IonItem>
            <IonItem lines='none' className='mb-1'>
              <CustomInput
                control={control}
                name='location_url'
                label='Website Eisladen'
                labelPosition='stacked'
                rules={{ required: 'Bitte ergänze das Land' }}
                placeholder='http://'
                inputmode='url'
              />
            </IonItem>

            <IonButton className='my-3 confirm-btn' type='submit' expand='block'>
              <IonIcon className='pe-1' icon={add} />
              Eintragen
            </IonButton>
          </form>
        ) : (
          <>Vielen Dank!</>
        )}
      </IonContent>
    </IonModal>
  );
};

export default NewLocationForm;

import { useContext } from 'react';
import { Context } from "../context/Context";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonModal } from '@ionic/react';
import { add, closeCircleOutline } from 'ionicons/icons';
import showError from './showError';
import LoadingError from './LoadingError';

const NewLocationForm = () => {
  const { 
    setError,
    newLocation, setNewLocation,
    newLocModal, setNewLocModal,
    enterAnimation, leaveAnimation,
    searchViewport
  } = useContext(Context);
  
  const defaultValues = { 
    name: '',
    street: newLocation ? newLocation.address.street : '',
    number: newLocation ? newLocation.address.number : '',
    zipcode: newLocation ? newLocation.address.zipcode : '',
    city: newLocation ? newLocation.address.city : '',
    country: 'Deutschland',
    location_url: ''
  }
  
  const { control, handleSubmit, formState: { errors } } = useForm({defaultValues});

  const onSubmit = async (data) => {
    try {
      const body = {
        name: data.name,
        address: {
          street: data.street,
          number: data.number,
          zipcode: data.zipcode,
          city: data.city,
          country: data.country,
          geo: {
            lat: newLocation.address.geo.lat,
            lng: newLocation.address.geo.lng
          }
        },
        location_url: data.location_url
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/locations`, options);
      const newData = await res.json();
      if (!newData) {
        setError('Fehler beim Eintragen. Bitte versuch es später nochmal.');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      setError(error)
      setTimeout(() => setError(null), 5000);
    };
    setNewLocation(null);
    searchViewport();
  };

  return (
    <IonModal cssClass='newLocModal' isOpen={newLocModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setNewLocModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
      <IonItem lines='full'>
        <IonLabel>Eisladen eintragen</IonLabel>
        <IonButton 
          fill="clear" 
          onClick={() => { 
            setNewLocModal(false);
            setNewLocation(null);
          }}>
          <IonIcon icon={closeCircleOutline}/>
        </IonButton>
      </IonItem>
      {newLocation ? (
        <IonContent className="ion-padding">
          {/* // See input fields in console
          // <form onSubmit={handleSubmit(data => console.log(data))}>
          // "handleSubmit" will validate your inputs before invoking "onSubmit" */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines="none" className="mb-1">
              <IonLabel position='floating' htmlFor="name">Name</IonLabel>
              <Controller
                  control={control}
                  render={({ 
                    field: { onChange, value },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <IonInput inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                  )}
                  name="name"
                  rules={{ required: true }}
                />
            </IonItem>
            {showError("name", errors)}

            <IonItem lines="none" className="mb-1">
              <IonLabel position='floating' htmlFor="street">Straße</IonLabel>
              <Controller
                control={control}
                render={({ 
                  field: { onChange, value },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                )}
                name="street"
                rules={{ required: true }}
              />
            </IonItem>
            {showError("street", errors)}
            
            <IonItem lines="none" className="mb-1">
              <IonLabel position='floating' htmlFor="number">Nummer</IonLabel>
              <Controller
                control={control}
                render={({ 
                  field: { onChange, value },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonInput type="number" inputmode="numeric" value={value} onIonChange={e => onChange(e.detail.value)} />
                )}
                name="number"
                rules={{ 
                  required: true,
                  maxLength: 3,
                  pattern: /^[0-9]+$/
                }}
              />
            </IonItem>
            {showError("number", errors)}

            <IonItem lines="none" className="mb-1">
              <IonLabel position='floating' htmlFor="zipcode">PLZ</IonLabel>
              <Controller
                control={control}
                render={({ 
                  field: { onChange, value },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonInput type="text" inputmode="numeric" value={value} onIonChange={e => onChange(e.detail.value)} />
                )}
                name="zipcode"
                rules={{ 
                  required: true,
                  maxLength: 5,
                  pattern: /^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/
                }}
              />
            </IonItem>
            {showError("zipcode", errors)}

            <IonItem lines="none" className="mb-1">
              <IonLabel position='floating' htmlFor="city">Stadt</IonLabel>
              <Controller
                control={control}
                render={({ 
                  field: { onChange, value },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                )}
                name="city"
                rules={{ required: true }}
              />
            </IonItem>
            {showError("city", errors)}

            <IonItem lines="none" className="mb-1">
              <IonLabel position='floating' htmlFor="country">Land</IonLabel>
              <Controller
                control={control}
                render={({ 
                  field: { onChange, value },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                )}
                name="country"
                rules={{ required: true }}
              />
            </IonItem>
            {showError("country", errors)}

            <IonItem lines="none" className="mb-1">
              <IonLabel position='stacked' htmlFor="location_url">Website Eisladen</IonLabel>
              <Controller
                control={control}
                render={({ 
                  field: { onChange, value },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonInput type="text" inputmode="url" value={value} onIonChange={e => onChange(e.detail.value)} placeholder="http://" />
                )}
                name="location_url"
              />
            </IonItem>
            {showError("location_url", errors)}
            
            <IonButton className="my-3" type="submit" expand="block">
              <IonIcon className="pe-1"icon={add}/>Neu eintragen
            </IonButton>
          </form>

        </IonContent>
      ) : <IonContent>Vielen Dank!</IonContent> }

      <LoadingError />
    </IonModal>
  )
};

export default NewLocationForm;

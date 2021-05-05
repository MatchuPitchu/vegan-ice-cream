import { useContext } from 'react';
import { Context } from "../context/Context";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { mailUnread } from 'ionicons/icons';
import showError from '../components/showError';

// Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started

const defaultValues = { 
  name: '',
  street: '',
  number: '',
  zipcode: '',
  country: 'Deutschland',
  location_url: 'http://'
}

const Eintragen = () => {
  const { toggle, error, setError } = useContext(Context);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({defaultValues});

  const onSubmit = async (data) => {
    const body = {
      name: data.name,
      address: {
        street: data.street,
        number: data.number,
        zipcode: data.zipcode,
        city: data.city,
        country: data.country,
        geo: {
          lat: data.lat,
          lng: data.lng
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
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/locations`, options);
      const newLocation = await res.json();
      if (!newLocation) {
        setError('Fehler beim Eintragen. Bitte versuch es später nochmal.');
        return () => setTimeout(setError(null), 5000);
      } 
      console.log(newLocation);
      reset(defaultValues);
    } catch (error) {
      setError(error)
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent className="ion-padding">
        <h3>Eisladen eintragen</h3>

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
            <IonLabel position='floating' htmlFor="location_url">Website Eisladen</IonLabel>
            <Controller
              control={control}
              render={({ 
                field: { onChange, value },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <IonInput type="url" inputmode="url" value={value} onIonChange={e => onChange(e.detail.value)} />
              )}
              name="location_url"
            />
          </IonItem>
          {showError("location_url", errors)}
          
          <IonButton className="mt-3" type="submit" expand="block"><IonIcon className="pe-1"icon={mailUnread}/>Absenden</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Eintragen;

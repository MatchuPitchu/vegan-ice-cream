import { useState, useContext } from 'react';
import { Context } from "../context/Context";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { add, mailUnread } from 'ionicons/icons';
import showError from '../components/showError';
import Spinner from '../components/Spinner';
import NewLocationForm from '../components/NewLocationForm';

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
  const { 
    toggle, 
    error, setError,
    loading, setLoading,
    locations,
    setNewLocation,
    setCenter,
    setAll
  } = useContext(Context);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({defaultValues});
  const [click, setClick] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    setAll(true);
    const fetchData = async () => {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(data.address)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const { results } = await res.json();
        console.log('Fetching data Google API:', results)
        setNewLocation({
          name: '',
          address: {
            street: results[0].address_components[1] ? results[0].address_components[1].long_name : '',
            number: results[0].address_components[0] ? results[0].address_components[0].long_name : '',
            zipcode: results[0].address_components[7] ? results[0].address_components[7].long_name : '',
            city: results[0].address_components[3] ? results[0].address_components[3].long_name : '',
            country: results[0].address_components[6] ? results[0].address_components[6].long_name : '',
            geo: {
              lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
              lng: results[0].geometry.location ? results[0].geometry.location.lng : null
            }
          },
          location_url: '',
          place_id: results[0].place_id ? results[0].place_id : ''
        })
      } catch (error) {
        setError('Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in Deutschland eintragen.')
      }
    };
    fetchData();
    setLoading(false);
    reset(defaultValues);
    setClick(true);
  };

  return !loading ? (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="ion-padding">
          <h3>Eisladen eintragen</h3>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines="none" className="mb-1 d-flex flex-column align-items-center">
              <IonLabel className="ion-text-wrap mb-3" position='stacked' htmlFor="address">Tippe den Namen des Eisladens und der Stadt ein. Wenn das nicht funktioniert, versuche es bitte nochmal und trage die vollständige Adresse (Straße, Hausnummer, Stadt) ein.</IonLabel>
              <Controller
                control={control}
                render={({ 
                  field: { onChange, value },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonInput color="primary" type="search" inputmode="text" value={value} autocomplete='street-address' onIonChange={e => onChange(e.detail.value)} placeholder="Name, Adresse eintippen ..." searchIcon={add} showCancelButton="always"	cancel-button-text="" />
                )}
                name="address"
                rules={{ required: true }}
              />
              <IonButton fill="solid" className="check-btn mb-2" type="submit">
                <IonIcon icon={add} />Checke deine Eingabe
              </IonButton>
            </IonItem>
          </form>
        </div>

        {click && <NewLocationForm />}
        
        <IonToast
          color='danger'
          isOpen={error ? true : false} 
          message={error} 
          onDidDismiss={() => setError('')}
          duration={6000} 
        />
      </IonContent>
    </IonPage>
  ) : <Spinner />;
};

export default Eintragen;

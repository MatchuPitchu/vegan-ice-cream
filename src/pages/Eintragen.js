import { useState, useContext } from 'react';
import { Context } from "../context/Context";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonPopover, IonToast } from '@ionic/react';
import { add, closeCircleOutline, disc, informationCircle, link } from "ionicons/icons";
import showError from '../components/showError';
import Spinner from '../components/Spinner';
import NewLocationForm from '../components/NewLocationForm';
import LoadingError from '../components/LoadingError';

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
    setAll,
    enterAnimation, leaveAnimation,
  } = useContext(Context);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({defaultValues});
  const [click, setClick] = useState(false);
  const [popover, setPopover] = useState({ show: false, event: undefined });

  const onSubmit = (data) => {
    setLoading(true);
    setAll(true);
    const fetchData = async () => {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(data.address)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const { results } = await res.json();
        let formattedObj = {};
        results[0].address_components.forEach(e => e.types.forEach(type => Object.assign(formattedObj, {[type]: e.long_name})));
        console.log('Formatted Obj', formattedObj);
        setNewLocation({
          name: '',
          address: {
            street: formattedObj.route ? formattedObj.route : '',
            number: formattedObj.street_number ? formattedObj.street_number : '',
            zipcode: formattedObj.postal_code ? formattedObj.postal_code : '',
            city: formattedObj.locality ? formattedObj.locality : '',
            country: formattedObj.country ? formattedObj.country : '',
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
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonButton fill="clear" onClick={e => {
              e.persist();
                setPopover({ show: true, event: e })
              }}
            >
              <IonIcon icon={informationCircle}></IonIcon>
            </IonButton>
            <IonPopover
              cssClass='my-custom-class'
              event={popover.event}
              isOpen={popover.show}
              onDidDismiss={() => setPopover({ show: false, event: undefined })}
            >
              <IonLabel color="primary">Tipp</IonLabel>
              <p>Noch komfortabler geht es direkt auf der Karte. Dort wird deine Eingabe automatisch vervollständigt.</p>
              <a href='/entdecken'>
                <IonIcon icon={disc} />
                <IonLabel className="ms-1">Entdecken</IonLabel>
              </a>
            </IonPopover>
            <IonCardTitle>Eisladen eintragen</IonCardTitle>
          </IonCardHeader>
          <IonItem lines="none">
            <IonLabel className="ion-text-wrap mb-2" position='stacked' htmlFor="address">Welchen Eisladen hast du entdeckt? Name und Stadt reichen zumeist. Wenn du nichts findest, trage nur die korrekte Adresse ein.
            </IonLabel>
          </IonItem>
          <IonCardContent>
            <form className="mb-3 d-flex flex-column align-items-center" onSubmit={handleSubmit(onSubmit)}>
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
            </form>
          </IonCardContent>
        </IonCard>
        
        <IonModal cssClass='newLocModal' isOpen={click} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setClick(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
          <IonItem lines='full'>
            <IonLabel>Eisladen eintragen</IonLabel>
            <IonButton fill="clear" onClick={() => { setClick(false)}}><IonIcon icon={closeCircleOutline}/></IonButton>
          </IonItem>
          <NewLocationForm />
        </IonModal>

        <LoadingError />

      </IonContent>
    </IonPage>
  ) : <Spinner />;
};

export default Eintragen;

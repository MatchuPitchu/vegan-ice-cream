import { useContext } from 'react';
import { Context } from "../context/Context";
import { Autocomplete } from '@react-google-maps/api';
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonModal, isPlatform } from '@ionic/react';
import { add, closeCircleOutline } from 'ionicons/icons';
import LoadingError from './LoadingError';

const AutocompleteForm = () => {
  const { 
    setError,
    setLoading,
    locations,
    setCenter,
    autocomplete, setAutocomplete,
    autocompleteModal, setAutocompleteModal,
    searchAutocomplete, setSearchAutocomplete,
    result, setResult,
    formattedAddress, setFormattedAddress,
    setNewLocation,
    setNewLocModal,
    enterAnimation, leaveAnimation,
  } = useContext(Context);

  const onSubmit = (e) => {
    e.preventDefault();
    if(!result) return;
    setLoading(true);

    const duplicate = locations.find(loc => loc.address.street === result.address.street && loc.address.number === result.address.number)    
    if(duplicate) {
      setResult(null)
      setError('Diese Adresse gibt es schon.');
      setTimeout(() => setError(null), 5000);
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(formattedAddress ? formattedAddress : searchAutocomplete)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
        const { results } = await res.json();

        if(result.address.number) {
          setNewLocation({
            ...result,
            address: {
              ...result.address,
              geo: {
                lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
                lng: results[0].geometry.location ? results[0].geometry.location.lng : null
              }
            }
          })
        } else {
          let address = {};
          results[0].address_components && results[0].address_components.forEach(e => e.types.forEach(type => Object.assign(address, {[type]: e.long_name})));
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
                lng: results[0].geometry.location ? results[0].geometry.location.lng : null
              }
            },
            location_url: '',
            place_id: address.place_id ? address.place_id : ''
          })
        }

        if(results[0].geometry.location) {
          setCenter({
            lat: results[0].geometry.location.lat,
            lng: results[0].geometry.location.lng
          });
        }
      } catch (error) {
        setError('Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in Deutschland eintragen.')
        setTimeout(() => setError(null), 5000);
      }
    };
    if(!duplicate) fetchData();
    setSearchAutocomplete('');
    setLoading(false);
    setAutocompleteModal(false);
  };

  const onPlaceChanged = () => {
    if(autocomplete !== null) {
      const data = autocomplete.getPlace();
      let address = {};
      data.address_components && data.address_components.forEach(e => e.types.forEach(type => Object.assign(address, {[type]: e.long_name})));
      setFormattedAddress(data.formatted_address);
      setResult({
        name: data.name ? data.name : '',
        address: {
          street: address.route ? address.route : '',
          number: address.street_number ? parseInt(address.street_number) : '',
          zipcode: address.postal_code ? address.postal_code : '',
          city: address.locality ? address.locality : '',
          country: address.country ? address.country : '',
          geo: {
            lat: null,
            lng: null
          }
        },
        location_url: data.website ? data.website : '',
        place_id: data.place_id ? data.place_id : ''
      })
    }
    else {
      setError('Autocomplete kann gerade nicht geladen werden');
      setTimeout(() => setError(null), 5000);
    }
  }

  const onAutocompleteLoad = (autocomplete) => {
    setAutocomplete(autocomplete)
  }

  return (
    <IonModal cssClass='newLocModal' isOpen={autocompleteModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setNewLocModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
      <IonItem lines='full'>
        <IonLabel>Eisladen eintragen</IonLabel>
        <IonButton 
          fill="clear" 
          onClick={() => { 
            setAutocompleteModal(false);
            setNewLocation(null);
          }}>
          <IonIcon icon={closeCircleOutline}/>
        </IonButton>
      </IonItem>
      <IonContent className="ion-padding">
        <form onSubmit={onSubmit}>
          <IonItem className="addLocForm" lines="none">
            <IonLabel className={`container ion-text-wrap ${isPlatform('desktop') ? 'mb-4' : 'my-2'}`} position="stacked">
              Welchen Eisladen hast du entdeckt? Name und Stadt reichen zumeist. Sonst trage die korrekte Adresse ein.
            </IonLabel>
            <Autocomplete
              className='container-autocomplete'
              onLoad={ onAutocompleteLoad }
              onPlaceChanged={ onPlaceChanged }
              restrictions={ { country: 'de' } }
              fields={ ['name', 'address_components', 'formatted_address', 'place_id', 'website']}
            >
              <input 
                type="text"
                placeholder="Name, Adresse eintippen ..."
                className="search-autocomplete"
                // value={searchText}
                onChange={(e) => setSearchAutocomplete(e.target.value)}
              />
            </Autocomplete>
            <IonButton fill="solid" className="check-btn my-3" type="submit">
              <IonIcon icon={add} />Check: Klicke auf neues grünes Icon auf Karte
            </IonButton>
          </IonItem>
        </form>
      </IonContent>
      <LoadingError />
    </IonModal>
  )
};

export default AutocompleteForm;

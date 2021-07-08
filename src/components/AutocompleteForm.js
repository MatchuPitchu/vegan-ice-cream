import { useContext } from 'react';
import { Context } from "../context/Context";
import { Autocomplete } from '@react-google-maps/api';
import { IonButton, IonCardSubtitle, IonContent, IonIcon, IonItem, IonLabel, IonModal } from '@ionic/react';
import { checkbox, closeCircleOutline, informationCircleOutline } from 'ionicons/icons';
import LoadingError from './LoadingError';

const AutocompleteForm = () => {
  const { 
    setError,
    setLoading,
    locations,
    setCenter,
    setZoom,
    autocomplete, setAutocomplete,
    autocompleteModal, setAutocompleteModal,
    searchAutocomplete, setSearchAutocomplete,
    result, setResult,
    formattedAddress, setFormattedAddress,
    setNewLocation,
    setCheckMsgNewLoc,
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
        // fetch results are restricted to countries DE, AT, CH, LI
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(formattedAddress ? formattedAddress : searchAutocomplete)}&components=country:DE|country:AT|country:CH|country:LI&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
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
          setZoom(18);
        }
      } catch (error) {
        setError('Ups, schief gelaufen. Versuche es nochmal. Du kannst nur Orte in Deutschland eintragen.')
        setTimeout(() => setError(null), 5000);
      }
    };
    if(!duplicate) fetchData();
    setSearchAutocomplete('');
    setCheckMsgNewLoc('Bestätige noch die Daten - klicke auf das grüne Icon')
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
      <IonContent>
        <form className="d-flex flex-column" onSubmit={onSubmit}>
          <IonItem className="mt-3 px-2 addLocForm" lines="none">
            <div className="ion-text-wrap" position="stacked">
              <IonCardSubtitle color="primary" className="mb-1">Welchen Eisladen hast du entdeckt?</IonCardSubtitle>
              <p style={{fontSize: '0.8rem'}}><IonIcon size="small" icon={informationCircleOutline} /> Name und Stadt reichen zumeist. Sonst trage die korrekte Adresse ein. Deutschland, Schweiz, Österreich und Liechtenstein sind aktuell verfügbar.</p>
            </div>
          </IonItem>
          <IonItem className="addLocForm" lines="none">
            {/* Restricts autocomplete to countries DE, AT, CH, LI*/}
            <Autocomplete
              className='container-autocomplete'
              onLoad={ onAutocompleteLoad }
              onPlaceChanged={ onPlaceChanged }
              restrictions={ { country: ['de', 'at', 'ch', 'li'] } }
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
          </IonItem>
          <IonButton fill="solid" className="check-btn my-3" type="submit">
            <IonIcon className="me-1" icon={checkbox} />Checke deine Eingabe
          </IonButton>
        </form>
      </IonContent>
      <LoadingError />
    </IonModal>
  )
};

export default AutocompleteForm;

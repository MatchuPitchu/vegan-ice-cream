import { useState, useContext, useCallback } from 'react';
import { Context } from "../context/Context";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const Geocoding = () => {
  const { toggle, mapStyles, showError, error, setError } = useContext(Context);
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ lat:  52.524, lng: 13.410 });

  const onSubmit = async (address) => {
    console.log(address);
    setLoading(true);
    const encodedAddress = encodeURI(address);
    const options = {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "google-maps-geocoding.p.rapidapi.com",
        "x-rapidapi-key": ""
      }
    };
    try {
      const res = await fetch(`https://google-maps-geocoding.p.rapidapi.com/geocode/json?language=en&address=${encodedAddress}`, options)
      console.log(res);
      const data = res.json();
      setPosition({lat: data.lat, lng: data.lng})
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  }

  const [geocoder, setGeocoder]= useState(null);
  const [map, setMap]= useState(null);

  const onMapLoad = useCallback((map) => {
    setMap(map);
    setGeocoder(new window.google.maps.Geocoder());
  }, []);

  function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new window.google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // libraries: ['places']
  })

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    gestureHandling: "cooperative",
    minZoom: 9,
    // restricted to boundaries of germany
    restriction: {
      latLngBounds: {
        north: 55.1,
        south: 47.1,
        west: 5.8,
        east: 15.1,
      },
    },
  }

  return (
    <IonPage>
    <IonHeader>
      <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
    </IonHeader>
      <p>Lat: {position.lat}</p>
      <p>Lng: {position.lng}</p>
    <IonContent>
      <GoogleMap 
        mapContainerClassName="mapContainer" 
        zoom={11} 
        center={position}
        options={options}
        onLoad={onMapLoad}
      >
      {map && (
        <Marker
          position={{lat: position.lat, lng: position.lng}}
          icon={{
            url: './assets/icons/current-position-marker.svg',
            scaledSize: new window.google.maps.Size(15, 15),
          }}
        />
      )}
      </GoogleMap>
      {/* <body onload={initialize()}> */}
        <div id="map" style={{width: "320px", height: "480px"}}></div>
        <div>
          <input id="address" type="textbox" value="Berlin" />
          <input type="button" value="Encode" onclick={codeAddress()} />
        </div>
      {/* </body> */}
    </IonContent>
  </IonPage>
  )
};

export default Geocoding;


      // <form onSubmit={handleSubmit(onSubmit)}>
      //   <IonItem lines="none" className="mb-1">
      //     <IonLabel position='floating' htmlFor="address">Adresse</IonLabel>
      //     <Controller
      //       control={control}
      //       render={({ 
      //         field: { onChange, value },
      //         fieldState: { invalid, isTouched, isDirty, error },
      //       }) => (
      //         <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
      //       )}
      //       name="address"
      //       rules={{ required: true }}
      //     />
      //   </IonItem>
      //   {/* {showError("address", errors)} */}
       
      //   <IonButton className="mt-3" type="submit" expand="block"><IonIcon className="pe-1"icon={locationOutline}/>Suche Location</IonButton>
      // </form>
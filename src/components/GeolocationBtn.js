import { useState } from 'react';
import { Geolocation } from '@ionic-native/geolocation';
import { IonButton, IonLoading, IonToast } from "@ionic/react";

const GeolocationBtn = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [position, setPosition] = useState();


  const getLocation = async () => {
    setLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      setPosition(position)
      setLoading(false);
    } catch (error) {
      setError(error.message.length > 0 ? error.message : 'Deine Position kann nicht ermittelt werden. Kontrolliere deine Einstellungen.')
      setLoading(false);
    }
  }

  return (
    <>

    </>
  )

}

export default GeolocationBtn;
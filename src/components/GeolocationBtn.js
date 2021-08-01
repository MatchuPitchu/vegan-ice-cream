import { useContext } from "react";
import { Context } from '../context/Context';
import { IonButton, IonIcon } from "@ionic/react"
import { closeCircleOutline, location as myPos } from "ionicons/icons";
import LoadingError from "./LoadingError";

const GeolocationBtn = () => {
  const {
    setError,
    setLoading,
    position, setPosition,
  } = useContext(Context);

  const handleClick = async () => {
    // if click when no position is displayed than enable watchPosition otherwise clear watchting und reset position to undefined
    if(!position) {
      setLoading(true);
      try {
        // define as var to have access below to clearWatch
        var watchID = await navigator.geolocation.watchPosition(
          pos => setPosition({lat: pos.coords.latitude, lng: pos.coords.longitude}),
          err => setError(err),
          { useSignificantChanges: true }
        )        
      } catch (err) {
        console.log(err);
        setError('Position kann nicht ermittelt werden. Berechtigung prüfen');
        setTimeout(() => setError(null), 5000);
      }
      setLoading(false);
    } else {
      setPosition(undefined);
      navigator.geolocation.clearWatch(watchID);
    }

  };

  return (
    <>
      <IonButton className="where-control" onClick={handleClick} title="Meinen Standort verfolgen">
        <IonIcon icon={myPos} />
        {position && <IonIcon className="close-center" size="small" icon={closeCircleOutline} /> }
      </IonButton>

      <LoadingError />
    </>
  )
}

export default GeolocationBtn

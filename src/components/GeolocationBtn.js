import { useContext, useState } from "react";
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

  const [watchID, setWatchID] = useState(undefined)

  const getPosition = async () => {
      setLoading(true);
      try {
        // define as var to have access below to clearWatch
        const id = await navigator.geolocation.watchPosition(
          pos => setPosition({lat: pos.coords.latitude, lng: pos.coords.longitude}),
          err => setError(err),
          { useSignificantChanges: true }
        )
        setWatchID(id);  
      } catch (err) {
        console.log(err);
        setError('Position kann nicht ermittelt werden. Berechtigung prüfen');
        setTimeout(() => setError(null), 5000);
      }
      setLoading(false);
  };

  const removeWatch = () => {
    setPosition(undefined);
    navigator.geolocation.clearWatch(watchID);
  }

  return (
    <>
      <IonButton 
        className="where-control" 
        onClick={!position ? getPosition : removeWatch}
        title="Eigenen Standort verfolgen"
      >
        <IonIcon icon={myPos} />
        {position && <IonIcon className="close-center-btn" size="small" icon={closeCircleOutline} /> }
      </IonButton>

      <LoadingError />
    </>
  )
}

export default GeolocationBtn

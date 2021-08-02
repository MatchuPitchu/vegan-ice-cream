import { useContext, useState, useEffect } from "react";
import { Context } from '../context/Context';
import { IonButton, IonIcon } from "@ionic/react"
import { close, navigateCircle, navigateCircleOutline } from "ionicons/icons";
import LoadingError from "./LoadingError";

const GeolocationBtn = () => {
  const {
    setError,
    setLoading,
    position, setPosition,
    setCenter
  } = useContext(Context);

  const [watchID, setWatchID] = useState(undefined);
  const [centerCoord, setCenterCoord] = useState([]);

  useEffect(() => {
    // setCenter to user position after first click on btn
    if(centerCoord.length) setCenter(centerCoord[0])
  }, [centerCoord])

  const getPosition = async () => {
      setLoading(true);
      try {
        // define as var to have access below to clearWatch
        const id = await navigator.geolocation.watchPosition(
          pos => {
            setPosition({lat: pos.coords.latitude, lng: pos.coords.longitude})
            // .some() tests whether at least one element in array is object and not null (because typeof item === 'object' returns also true when null)
            // first call setCenterCoord to currect position, after that, array is no longer changed  
            setCenterCoord(prev => prev.some(item => typeof item === 'object' && item !== null) ? prev : [{lat: pos.coords.latitude, lng: pos.coords.longitude}])
          },
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
    setCenterCoord([]);
    navigator.geolocation.clearWatch(watchID);
  }

  return (
    <>
      <IonButton 
        className="where-control" 
        onClick={!position ? getPosition : removeWatch}
        title={!position ? "Eigenen Standort verfolgen" : "Standortanzeige aus"}
      >
        <IonIcon icon={!position ? navigateCircleOutline : navigateCircle} />
        {position && <IonIcon className="close-center-btn" size="small" icon={close} /> }
      </IonButton>

      <LoadingError />
    </>
  )
}

export default GeolocationBtn

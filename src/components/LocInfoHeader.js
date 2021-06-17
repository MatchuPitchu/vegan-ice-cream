import { useContext } from "react";
import { Context } from '../context/Context';
import { IonAvatar, IonItem, IonLabel } from "@ionic/react"
import FavLocBtn from "./FavLocBtn"

const LocInfoHeader = ({loc}) => {
  const { 
    user,
  } = useContext(Context);

  return (
    <IonItem lines="full">
      <IonAvatar slot='start'>
        <img src='./assets/icons/ice-cream-icon-dark.svg' />
      </IonAvatar>
      <IonLabel className="ion-text-wrap">
        <p style={{"color":"var(--ion-text-color)"}}>{loc.name}</p>
        <p>{loc.address.street} {loc.address.number}</p>
        <p className="mb-1">{loc.address.zipcode} {loc.address.city}</p>
        {loc.location_url && ( 
          <p>
            <a className="websiteLink" href={loc.location_url.includes("http") ? loc.location_url : `//${loc.location_url}`} target="_blank">{loc.location_url}</a>
          </p> 
        )}
      </IonLabel>
      {user ? <FavLocBtn selectedLoc={loc}/> : null}
    </IonItem>
  )
}

export default LocInfoHeader

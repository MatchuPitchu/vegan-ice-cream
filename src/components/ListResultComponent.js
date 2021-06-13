import { useContext } from "react";
import { Context } from '../context/Context';
import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { add, open } from "ionicons/icons";
import FavLocBtn from './FavLocBtn';
import Ratings from "./Ratings";

const ListResultComponent = ({loc}) => {
  const {
    user,
    setSelected,
    setSearchSelected,
    setInfoModal,
    setOpenComments
  } = useContext(Context);

  return (
    <IonCard >
      <IonItem lines="full">
        <IonAvatar slot='start'>
          <img src='./assets/icons/ice-cream-icon-dark.svg' />
        </IonAvatar>
        <IonLabel >
          {loc.name}
          <p>{loc.address.street} {loc.address.number}</p>
          <p className="mb-2">{loc.address.zipcode} {loc.address.city}</p>
          <p>
            <a className="websiteLink" href={loc.location_url.includes("http") ? loc.location_url : `//${loc.location_url}`} target="_blank">{loc.location_url}</a>
          </p>
        </IonLabel>
        {user ? <FavLocBtn selectedLoc={loc}/> : null}
      </IonItem>
      
      <div className="px-3 py-2">     
        {loc.location_rating_quality ? (
        <>
          <Ratings selectedLoc={loc}/> 
          <div className="d-flex align-items-center">
            <IonButton 
              className="more-infos mt-1" 
              title="Mehr Infos"
              fill="solid"
              onClick={() => {
                setOpenComments(false);
                setSelected(loc); 
                setInfoModal(true) 
              }}
            >
              <IonIcon className="me-1" icon={open} />Mehr Infos
            </IonButton>
            <IonButton
              className="more-infos mt-1" 
              onClick={() => {
                setSearchSelected(loc);
                setOpenComments(false);
                setSelected(null);
                setInfoModal(false);
              }} 
              fill="solid"
              routerLink="/bewerten" 
              routerDirection="forward"
            >
              <IonIcon icon={add}/>Bewertung schreiben
            </IonButton>
          </div>
        </> 
        ) : (
          <IonButton
            className="more-infos mt-1" 
            onClick={() => {
              setSearchSelected(loc);
              setOpenComments(false);
              setSelected(null);
              setInfoModal(false);
            }} 
            fill="solid"
            routerLink="/bewerten" 
            routerDirection="forward"
          >
            <IonIcon icon={add}/>Erste Bewertung schreiben
          </IonButton>       
        )}
        
      </div>
    </IonCard>
  )
}

export default ListResultComponent

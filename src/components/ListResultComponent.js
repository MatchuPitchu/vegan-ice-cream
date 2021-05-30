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
          <p><a href={loc.location_url} target="_blank">Webseite</a></p>
        </IonLabel>
        {user ? <FavLocBtn selectedLoc={loc}/> : null}
      </IonItem>
      
      <IonCardContent>
        <div className="d-flex align-items-center">
          <IonCardSubtitle color='primary'>Bewertung schreiben</IonCardSubtitle>
          <IonButton
            onClick={() => {
              setSearchSelected(loc);
              setOpenComments(false);
              setSelected(null);
              setInfoModal(false);
            }} 
            fill="clear" 
            routerLink="/bewerten" 
            routerDirection="forward"
          >
            <IonIcon icon={add}/>
          </IonButton>
        </div>
        
        {loc.location_rating_quality ? (
        <>
          <Ratings selectedLoc={loc}/> 
          <IonButton 
            className="more-infos mt-2" 
            title="Mehr Infos"
            onClick={() => {
              setOpenComments(false);
              setSelected(loc); 
              setInfoModal(true) 
            }}
          >
            <IonIcon className="me-1" icon={open} />Mehr Infos
          </IonButton>
        </> 
        ) : <div className="py-1">Schreib die erste Bewertung</div>}
        
      </IonCardContent>
    </IonCard>
  )
}

export default ListResultComponent

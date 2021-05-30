import { useContext } from "react";
import { Context } from "../context/Context";
import { IonContent, IonPage, IonHeader, IonCard, IonCardSubtitle, IonCardContent, IonIcon, IonLabel, IonButton, IonItem, IonAvatar } from "@ionic/react";
import { add, open } from "ionicons/icons";
import Spinner from '../components/Spinner';
import LoadingError from "../components/LoadingError";
import FavLocBtn from "../components/FavLocBtn";
import Ratings from "../components/Ratings";
import SelectedMarker from "../components/SelectedMarker";

const Favoriten = () => {
  const { 
    isAuth, 
    user,
    toggle,
    setOpenComments,
    setSearchSelected,
    selected, setSelected, 
    setInfoModal,
  } = useContext(Context);

  return isAuth && user ? (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/header-favoriten-dark.svg" : "./assets/header-favoriten-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <div className="container-sm mt-3">
          {user.favorite_locations && user.favorite_locations.map((loc) => (
          <IonCard key={loc._id} >
            <IonItem lines="full">
              <IonAvatar slot='start'>
                <img src='./assets/icons/ice-cream-icon-dark.svg' />
              </IonAvatar>
              <IonLabel >
                {loc.name}
                <p>{loc.address.street} {loc.address.number}</p>
                <p className="mb-2">{loc.address.zipcode} {loc.address.city}</p>
                <p><a href={loc.location_url}>Webseite</a></p>
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
          ))}
        </div>
        
        {selected ? <SelectedMarker /> : null}

        <LoadingError />

      </IonContent>
    </IonPage>
  ) : (
  <IonPage>
    <Spinner />;
  </IonPage>
  )
};

export default Favoriten;

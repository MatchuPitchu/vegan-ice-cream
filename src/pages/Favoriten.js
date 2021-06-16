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
        <div className="mt-3">
          {user.favorite_locations && user.favorite_locations.map((loc) => (
          <IonCard key={loc._id} >
            <IonItem lines="full">
              <IonAvatar slot='start'>
                <img src='./assets/icons/ice-cream-icon-dark.svg' />
              </IonAvatar>
              <IonLabel className="ion-text-wrap">
                <p style={{"color":"var(--ion-text-color)"}}>{loc.name}</p>
                <p>{loc.address.street} {loc.address.number}</p>
                <p className="mb-2">{loc.address.zipcode} {loc.address.city}</p>
                {loc.location_url && ( 
                  <p>
                    <a className="websiteLink" href={loc.location_url.includes("http") ? loc.location_url : `//${loc.location_url}`} target="_blank">{loc.location_url}</a>
                  </p> 
                )}
              </IonLabel>
              {user ? <FavLocBtn selectedLoc={loc}/> : null}
            </IonItem>
            
            <div className="px-3 py-2">
              {loc.location_rating_quality ? (
              <>
                <Ratings 
                  rating_vegan_offer={loc.location_rating_vegan_offer}
                  rating_quality={loc.location_rating_quality}
                />
                <div className="text-center">
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
                    <IonIcon icon={add}/>Bewerten
                  </IonButton>
                </div>
              </>
              ) : (
                <IonButton
                  className="more-infos mt-1"
                  fill="solid"
                  onClick={() => {
                    setSearchSelected(loc);
                    setOpenComments(false);
                    setSelected(null);
                    setInfoModal(false);
                  }}
                  routerLink="/bewerten" 
                  routerDirection="forward"
                >
                  <IonIcon icon={add}/>Erste Bewertung schreiben
                </IonButton>
              )}
            </div>
          </IonCard>
          ))}
        </div>
        
        {selected ? <SelectedMarker /> : null}

        <LoadingError />

      </IonContent>
    </IonPage>
  ) : (
  <IonPage>
    <Spinner />
  </IonPage>
  )
};

export default Favoriten;

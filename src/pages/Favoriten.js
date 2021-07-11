import { useContext } from "react";
import { Context } from "../context/Context";
import { IonContent, IonPage, IonHeader, IonCard,IonIcon, IonButton, isPlatform } from "@ionic/react";
import { add } from "ionicons/icons";
import Spinner from '../components/Spinner';
import LoadingError from "../components/LoadingError";
import Ratings from "../components/Ratings";
import SelectedMarker from "../components/SelectedMarker";
import BtnInfoRating from "../components/Comments/BtnInfoRating";
import LocInfoHeader from "../components/LocInfoHeader";

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
        {user.favorite_locations && user.favorite_locations.map((loc) => (
        <IonCard key={loc._id} className={`${isPlatform('desktop') ? "cardIonic" : ""}`} >
          
          <LocInfoHeader loc={loc} />
          
          <div className="px-3 py-2">
            {loc.location_rating_quality ? (
            <>
              <Ratings 
                rating_vegan_offer={loc.location_rating_vegan_offer}
                rating_quality={loc.location_rating_quality}
                showNum={true}
              />
              <BtnInfoRating loc={loc} />
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

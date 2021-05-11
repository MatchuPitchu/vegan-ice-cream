import { useContext, useState } from "react";
import { Context } from "../context/Context";
// https://www.npmjs.com/package/react-rating-stars-component
import ReactStars from "react-rating-stars-component";
import { IonContent, IonPage, IonHeader, IonCard, IonCardSubtitle, IonCardContent, IonIcon, IonLabel, IonButton, IonItem, IonAlert, IonToast, IonBadge } from "@ionic/react";
import { bookmarks, removeCircle } from "ionicons/icons";
import Spinner from '../components/Spinner';
import LoadingError from "../components/LoadingError";

const Favoriten = () => {
  const { 
    error, setError,
    isAuth, 
    user, setUser,
    toggle,
    removeFavLoc,
    alertUpdateFav, setAlertUpdateFav,
  } = useContext(Context);

  return isAuth && user ? (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <div className="container-sm mt-3">
          {user.favorite_locations && user.favorite_locations.map((loc) => (
          <IonCard key={loc._id} >
            <IonItem lines="full">
              <IonLabel >
                {loc.name}
                <p>{loc.address.street} {loc.address.number}</p>
                <p className="mb-2">{loc.address.zipcode} {loc.address.city}</p>
                <p><a href={loc.location_url}>Webseite</a></p>
              </IonLabel>
              <IonButton fill="clear" onClick={() => setAlertUpdateFav({...alertUpdateFav, removeStatus: true, location: loc})}>
                <IonIcon icon={bookmarks}/>
                <IonBadge slot="end" color="danger">-</IonBadge>
              </IonButton>
              <IonAlert
                isOpen={alertUpdateFav.removeStatus}
                onDidDismiss={() => setAlertUpdateFav({...alertUpdateFav, removeStatus: false })}
                header={'Favoriten entfernen'}
                message={'Möchtest du den Eisladen wirklich von deiner Liste entfernen?'}
                buttons={[
                  { text: 'Abbrechen', role: 'cancel' },
                  { text: 'Bestätigen', handler: removeFavLoc }
                ]}
              />
            </IonItem>
            
            <IonCardContent>
              <IonCardSubtitle color='primary'>Bewertung Community</IonCardSubtitle>
              {loc.location_rating_quality ? (
                <>
                  <div className="d-flex align-items-center">
                    <div className="me-2">Eis-Qualität</div>
                    <div>
                      <ReactStars
                        count={5}
                        value={loc.location_rating_quality}
                        edit={false}
                        size={18}
                        color='#9b9b9b'
                        activeColor='#de9c01'
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="me-2">Veganes Angebot</div>
                    <div>
                      <ReactStars 
                        count={5}
                        value={loc.location_rating_vegan_offer}
                        edit={false}
                        size={18}
                        color='#9b9b9b'
                        activeColor='#de9c01'
                      />
                    </div>
                  </div>
                </>
              ) : (
                <p>Noch keine Bewertungen vorhanden</p>
              )}
            </IonCardContent>
          </IonCard>
          ))}
        </div>
        
        <LoadingError />

      </IonContent>
    </IonPage>
  ) : <Spinner />;
};

export default Favoriten;

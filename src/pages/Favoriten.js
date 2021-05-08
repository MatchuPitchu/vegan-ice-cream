import { useContext, useState } from "react";
import { Context } from "../context/Context";
// https://www.npmjs.com/package/react-rating-stars-component
import ReactStars from "react-rating-stars-component";
import { IonContent, IonPage, IonHeader, IonCard, IonCardSubtitle, IonCardContent, IonIcon, IonLabel, IonButton, IonItem, isPlatform, IonInfiniteScroll, IonInfiniteScrollContent, IonAvatar, IonAlert, IonToast, IonBadge } from "@ionic/react";
import { bookmarks, removeCircle } from "ionicons/icons";
import Spinner from '../components/Spinner';

const Favoriten = () => {
  const { 
    error, setError,
    isAuth, 
    user, setUser,
    toggle
  } = useContext(Context);
  
  const [alertRemoveFav, setAlertRemoveFav] = useState({removeStatus: false, loc: null});

  const updateFavLoc = async () => {
    console.log(alertRemoveFav.loc._id)
    console.log(user._id)
    const token = localStorage.getItem('token');
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token
        },
        // converts JS data into JSON string.
        body: JSON.stringify({remove_location_id: alertRemoveFav.loc._id}),
        credentials: "include",
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/remove-fav-loc`, options);
      const updatedUser = await res.json();
      if (updatedUser) {
        setUser({
          ...user,
          favorite_locations: updatedUser.favorite_locations
        });
        setAlertRemoveFav({removeStatus: false, loc: null});
      } else {
        setError('Da ist etwas schief gelaufen. Versuche es später nochmal.')
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.log(error);
    };
  };

  console.log(alertRemoveFav)

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
              <IonButton fill="clear" onClick={() => setAlertRemoveFav({removeStatus: true, loc})}>
                <IonIcon icon={bookmarks}/>
                <IonBadge className="" slot="end" color="danger">-</IonBadge>
              </IonButton>
              <IonAlert
                isOpen={alertRemoveFav.removeStatus}
                onDidDismiss={() => setAlertRemoveFav({removeStatus: false, loc: null})}
                header={'Favoriten entfernen'}
                message={'Möchtest du den Eisladen wirklich von deiner Liste entfernen?'}
                buttons={[
                  {
                    text: 'Abbrechen',
                    role: 'cancel'
                  },
                  {
                    text: 'Bestätigen',
                    handler: updateFavLoc
                  }
                ]}
              />
            </IonItem>
            
            <IonCardContent>
              <IonCardSubtitle color='primary'>Bewertung Community</IonCardSubtitle>
              {loc.location_rating_quality ? (
                <>
                  <div className="d-flex align-items-center">
                    <div className="me-2">Qualität des Eises</div>
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
              <p className="p-weak">Location ID: {loc._id}</p>
                  
            </IonCardContent>
          </IonCard>
          ))}
        </div>
        <IonToast
          color='danger'
          isOpen={error ? true : false} 
          message={error} 
          onDidDismiss={() => setError('')}
          duration={6000} 
        />
      </IonContent>
    </IonPage>
  ) : <Spinner />;
};

export default Favoriten;

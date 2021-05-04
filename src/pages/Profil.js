import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
// https://www.npmjs.com/package/react-rating-stars-component
import ReactStars from "react-rating-stars-component";
import { IonContent, IonPage, IonHeader, IonTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon, IonLabel, IonButton, IonItem, isPlatform } from "@ionic/react";
import { idCard, mail, pin, star, walk, warning, wifi, wine } from "ionicons/icons";
import Spinner from '../components/Spinner';

const Login = () => {
  const { isAuth, user, toggle } = useContext(Context);
  
  return isAuth && user ? (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <div className="container-sm mt-3">
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Profil</IonCardSubtitle>
              <IonCardTitle>{user.name}</IonCardTitle>
            </IonCardHeader>
            <IonItem lines="none">
              <IonIcon icon={mail} slot="start" />
              <IonLabel>E-Mail</IonLabel>
            </IonItem>
            <IonCardContent>
              {user.email}
            </IonCardContent>
            <IonItem lines="none">
              <IonIcon icon={idCard} slot="start" />
              <IonLabel>Deine User ID</IonLabel>
            </IonItem>
            <IonCardContent>
              {user._id}
           </IonCardContent>
            <IonItem lines="none">
              <IonIcon icon={star} slot="start" />
              <IonLabel>Deine Bewertungen</IonLabel>
            </IonItem>
            <IonCardContent>
              {user.comments_list && user.comments_list.map((comment, i) => {
                return (
                  <>
                    <IonCardSubtitle color='primary' key={i}>{i+1}. Bewertung</IonCardSubtitle>
                    <p>{comment.text}</p>
                    <div className="d-flex align-items-center">
                      <div className="me-2">Qualität</div>
                      <div>
                        <ReactStars
                          count={5}
                          value={comment.rating_quality}
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
                          value={comment.rating_vegan_offer}
                          edit={false}
                          size={18}
                          color='#9b9b9b'
                          activeColor='#de9c01'
                        />
                      </div>
                    </div>
                    <p className="p-weak">[REPLACE WITH LOC NAME + LINK] Location ID: {comment.location_id}</p>
                    <p className="p-weak mb-3">{comment.date.replace('T', ' // ').slice(0, 19)}</p>
                  </>
                )
              })}
           </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  ) : <Spinner />;
};

export default Login;
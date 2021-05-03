import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { IonContent, IonPage, IonHeader, IonTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon, IonLabel, IonButton, IonItem, isPlatform } from "@ionic/react";
import { idCard, mail, pin, star, walk, warning, wifi, wine } from "ionicons/icons";
import Spinner from '../components/Spinner';

const Login = () => {
  const { isAuth, user, toggle } = useContext(Context);
  
  console.log(user)

  return user ? (
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
                    <IonCardSubtitle key={comment}>{i+1}. Bewertung</IonCardSubtitle>
                    <p className="mb-3">HIER MUSS ICH DATEN AUS FETCH COMMENTS INTEGRIEREN</p>
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
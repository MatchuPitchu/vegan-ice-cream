import { useContext, useState } from "react";
import { Context } from "../context/Context";
// https://www.npmjs.com/package/react-rating-stars-component
import ReactStars from "react-rating-stars-component";
import { IonButton, IonContent, IonPage, IonHeader, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon, IonLabel, IonItem, IonItemGroup, IonPopover } from "@ionic/react";
import { add, caretDownCircle, caretForwardCircle, closeCircleOutline, iceCream, idCard, informationCircle, mail, star } from "ionicons/icons";
import Spinner from '../components/Spinner';

const Profil = () => {
  const { isAuth, toggle, user, setShowProfil, locations } = useContext(Context);
  const [showComments, setShowComments] = useState(false);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });

  console.log(user.favorite_flavors)

  return isAuth && user && locations ? (
    <IonPage>
      <IonHeader>
        <IonItem color="tab-bar-background" lines="none">
          <IonButton slot="end" fill="clear" onClick={() => setShowProfil(false)}>
            <IonIcon icon={closeCircleOutline}/>
          </IonButton>
        </IonItem>
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

            <IonItemGroup>
              <IonItem lines="full">
                <IonIcon 
                  slot="start"
                  color={`${showComments ? "tertiary" : "primary"}`} 
                  icon={showComments ? caretDownCircle : caretForwardCircle} 
                  button onClick={() => {
                    setShowComments(prev => !prev);
                  }}
                />
                <IonLabel>Meine Bewertungen</IonLabel>
              </IonItem>

              {showComments && user.comments_list && user.comments_list.map((comment, i) => {
                return (
                <IonItem key={comment._id} lines="full">
                  <IonLabel className="ion-text-wrap ms-1">
                    {i+1}. {comment.location_id.name}
                    <p className="my-1">{comment.text}</p>
                    <div className="d-flex align-items-center">
                      <div className="me-2">Eis-Qualität</div>
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
                    <p className="p-weak mt-1">Datum: {comment.date.replace('T', ' // ').slice(0, 19)}</p>
                  </IonLabel>

                </IonItem>
                )}
              )}

              <IonItem lines="none">
                <IonIcon 
                  slot="start"
                  color="primary"
                  icon={iceCream}
                />
                <IonLabel>Mein Lieblingseis</IonLabel>
                <div>
                  <IonIcon
                    className="infoIcon"
                    color="primary"
                    button 
                    onClick={e => {
                      e.persist();
                      setPopoverShow({ show: true, event: e })
                    }}
                    icon={informationCircle} 
                  />

                </div>
                <IonPopover
                  color="primary"
                  cssClass='my-custom-class'
                  event={popoverShow.event}
                  isOpen={popoverShow.show}
                  onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
                >
                  <p>Diese Sorten hast du bei deinen Bewertungen angegeben</p>
                </IonPopover>
              </IonItem>
              
              {user.favorite_flavors.map(ice => {
                return (
                  <div key={ice._id} style={{backgroundColor: 'var(--ion-background-color)'}}>
                    <IonCardHeader>{ice.name}</IonCardHeader>
                    <div className="iceContainer">
                      <div className="icecream" style={{background: `linear-gradient(to bottom, ${ice.ice_color.color_primary}, ${ice.ice_color.color_secondary} )`}}></div>
                      <div className="icecreamBottom" style={{background: ice.ice_color.color_primary}}></div>
                      <div className="cone"></div>
                    </div>
                  </div>
                )}
              )}
             


            </IonItemGroup>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  ) : <Spinner />;
};

export default Profil

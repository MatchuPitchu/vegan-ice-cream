import { Fragment, useContext, useState } from "react";
import { Context } from "../context/Context";
// https://www.npmjs.com/package/react-rating-stars-component
import { IonButton, IonContent, IonPage, IonHeader, IonCard,  IonCardTitle, IonIcon, IonLabel, IonItem, IonItemGroup, IonPopover } from "@ionic/react";
import { caretDownCircle, caretForwardCircle, closeCircleOutline, iceCream, informationCircle, mail, refreshCircle, trailSign } from "ionicons/icons";
import ProfilUpdate from '../components/ProfilUpdate';
import Spinner from '../components/Spinner';
import CommentsBlock from "./Comments/CommentsBlock";
import FlavorsBlock from "./Comments/FlavorsBlock";

const Profil = () => {
  const { 
    isAuth, 
    toggle, 
    user, 
    setShowProfil, 
    locations, 
    showUpdateProfil, 
    setShowUpdateProfil,
    successMsg 
  } = useContext(Context);
  const [showComments, setShowComments] = useState(false);
  const [showFlavors, setShowFlavors] = useState(false);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });
  const [popoverCity, setPopoverCity] = useState({ show: false, event: undefined });

  return isAuth && user && locations ? (
    <IonPage>
      <IonHeader>
        <IonItem color="background-color" lines="none">
          <IonLabel color="primary">Profil</IonLabel>
          <IonButton slot="end" fill="clear" onClick={() => setShowProfil(false)}>
            <IonIcon icon={closeCircleOutline}/>
          </IonButton>
        </IonItem>
        <img className="headerImg" src={`${toggle ? "./assets/header-profil-dark.svg" : "./assets/header-profil-light.svg"}`} alt="" />
      </IonHeader>
      <IonContent>
        <div className="mt-3">
          <IonCard>
            <IonItem className="d-flex align-items-center" lines="full">
              <IonCardTitle className="me-2 my-3 ion-text-wrap">{user.name}</IonCardTitle>
              <IonButton  
                className="update-btn ms-auto"
                onClick={() => setShowUpdateProfil(prev => !prev)}
              >
                <IonIcon className="me-1" icon={refreshCircle}/>Update
              </IonButton>
            </IonItem>

            {showUpdateProfil && (
              <ProfilUpdate />
            )}

            {successMsg && (
              <IonItem className='successMsg text-center' lines="full">
                {successMsg}
              </IonItem>
            )}

            <IonItem color="background-color" className="borderBottom" lines="none">
              <IonIcon icon={mail} slot="start" />
              <IonLabel>{user.email}</IonLabel>
            </IonItem>
            <IonItem color="background-color" className="borderBottom" lines="none">
              <IonIcon icon={trailSign} slot="start" />
              <IonLabel>{user.home_city.city ? user.home_city.city : 'keinen Ort angegeben'}</IonLabel>
              <div>
                <IonIcon
                  className="infoIcon"
                  color="primary"
                  button 
                  onClick={e => {
                    e.persist();
                    setPopoverCity({ show: true, event: e })
                  }}
                  icon={informationCircle} 
                />
              </div>
              <IonPopover
                color="primary"
                cssClass='info-popover'
                event={popoverCity.event}
                isOpen={popoverCity.show}
                onDidDismiss={() => setPopoverCity({ show: false, event: undefined })}
              >
                Dieser Ort wird dir immer beim ersten Öffnen der Karte angezeigt.
              </IonPopover>
            </IonItem>
            <IonItemGroup>
              <IonItem color="background-color" className={`${!showComments && 'borderBottom'}`} lines="none">
                <IonIcon 
                  slot="start"
                  color="primary"
                  icon={showComments ? caretDownCircle : caretForwardCircle} 
                  button onClick={() => setShowComments(prev => !prev)}
                />
                <IonLabel>Meine Bewertungen</IonLabel>
                <IonButton 
                  fill="solid"
                  className="commentNum me-0"
                  onClick={() => setShowComments(prev => !prev)}
                >
                  {user.comments_list.length ? user.comments_list.length : '0'} 
                </IonButton>
              </IonItem>
    
              {showComments && user.comments_list ? user.comments_list.map(comment => {
                return (
                  <Fragment key={comment._id} >
                    <div className="locationTitle mx-3 mt-3">
                      {comment.location_id.name}
                      <div className="underlining"></div>
                    </div>
                    <CommentsBlock comment={comment} />
                  </Fragment>
                )
              }) : null}

              <IonItem color="background-color" lines="none">
                <IonIcon
                  className={showFlavors ? 'rotateIcon90Forward' : 'rotateIcon90Back'}
                  slot="start"
                  color="primary"
                  icon={iceCream}
                  button onClick={() => setShowFlavors(prev => !prev)}
                />
                <IonLabel>Meine Eissorten</IonLabel>
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
                  cssClass='info-popover'
                  event={popoverShow.event}
                  isOpen={popoverShow.show}
                  onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
                >
                  Angaben aus deinen Bewertungen
                </IonPopover>
              </IonItem>
              
              {showFlavors && user.favorite_flavors.length ? <FlavorsBlock flavorsList={user.favorite_flavors} /> : null}

            </IonItemGroup>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  ) : <Spinner />;
};

export default Profil

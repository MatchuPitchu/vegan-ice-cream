import { useContext, useState } from "react";
import { Context } from "../context/Context";
// https://www.npmjs.com/package/react-rating-stars-component
import ReactStars from "react-rating-stars-component";
import { IonButton, IonContent, IonPage, IonHeader, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon, IonLabel, IonItem, IonItemGroup, IonPopover } from "@ionic/react";
import { add, caretDownCircle, caretForwardCircle, chatboxEllipses, closeCircleOutline, footsteps, iceCream, idCard, informationCircle, mail, refreshCircle, star, trailSign } from "ionicons/icons";
import Spinner from '../components/Spinner';

const Profil = () => {
  const { isAuth, toggle, user, setShowProfil, locations } = useContext(Context);
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
        <img className="headerImg" src={`${toggle ? "./assets/header-profil-dark.svg" : "./assets/header-profil-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <div className="container-sm mt-3">
          <IonCard>
            <IonCardHeader className="d-flex align-items-center">
              <IonCardTitle className="me-2">{user.name}</IonCardTitle>
              <IonButton className="update-btn ms-auto">
                <IonIcon className="me-1" icon={refreshCircle}/>Update
              </IonButton>
            </IonCardHeader>
            <IonItem lines="none">
              <IonIcon icon={mail} slot="start" />
              <IonLabel>{user.email}</IonLabel>
            </IonItem>
            <IonItem lines="full">
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
              <IonItem lines="full">
                <IonIcon 
                  slot="start"
                  color="primary"
                  icon={showComments ? caretDownCircle : caretForwardCircle} 
                  button onClick={() => {
                    setShowComments(prev => !prev);
                  }}
                />
                <IonLabel>Meine Bewertungen</IonLabel>
                <IonButton 
                  onClick={() => {
                    setShowComments(prev => !prev);
                  }}
                  fill="solid" 
                  className="click-btn my-3"
                >
                  {user.comments_list.length ? user.comments_list.length : '0'} 
                </IonButton>
              </IonItem>

              {showComments && user.comments_list ? user.comments_list.map(comment => {
                return (
                  <div key={comment._id}>
                    <IonItem className="ms-1" lines="none">
                      <IonLabel color="primary">{comment.location_id.name}</IonLabel>
                    </IonItem>
                    <IonItem key={comment._id} lines="full">
                      <IonLabel color="text-color" className="ion-text-wrap mt-0 ms-1">
                        <p><IonIcon className="me-2" color={`${toggle ? '' : 'primary'}`} icon={chatboxEllipses}/>{comment.text}</p>
                        
                        <div className="d-flex align-items-center">
                          {comment.flavors_referred.map(flavor => {
                            return (
                              <IonButton key={flavor._id} disabled fill="solid" className="click-btn my-3">
                                <IonIcon color={`${toggle ? "warning" : "secondary"}`} className="pe-1" icon={iceCream} />
                                {flavor.name}
                              </IonButton>
                              )
                            })
                          }
                        </div>
                      
                        <div className="d-flex align-items-center">
                          <div className="me-2">Eis-Erlebnis</div>
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
                  </div>
                )}
              ) : null}

              <IonItem color="card-background" lines="none">
                <IonIcon
                  className={showFlavors ? 'rotateIcon90Forward' : 'rotateIcon90Back'}
                  slot="start"
                  color="primary"
                  icon={iceCream}
                  button onClick={() => {
                    setShowFlavors(prev => !prev);
                  }}
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
              
              {showFlavors && user.favorite_flavors.length ? (
                <div className="d-flex justify-content-around flex-wrap px-3 py-2">
                  {user.favorite_flavors.map(flavor => {
                    return (
                      <div key={flavor._id}>
                        <div className="iceContainer">
                          <div className="icecream" style={{background: `linear-gradient(to bottom, ${flavor.color.primary}, ${flavor.color.secondary} )`}}></div>
                          <div className="icecreamBottom" style={{background: flavor.color.primary}}></div>
                          <div className="cone"></div>
                        </div>
                        <div className="labelFlavor">{flavor.name}</div>
                      </div>
                      )
                    })
                  }
                </div>
              ) : null}

            </IonItemGroup>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  ) : <Spinner />;
};

export default Profil

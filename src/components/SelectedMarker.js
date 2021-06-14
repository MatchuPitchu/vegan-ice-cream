import { useContext, useEffect } from "react";
import { Context } from '../context/Context';
import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonItem, IonItemGroup, IonLabel, IonModal } from "@ionic/react";
import ReactStars from "react-rating-stars-component";
import { add, caretDownCircle, caretForwardCircle, chatboxEllipses, closeCircleOutline, iceCream, star, starHalfOutline, starOutline } from "ionicons/icons";
import FavLocBtn from "./FavLocBtn";
import LoadingError from "./LoadingError";
import Ratings from "./Ratings";

const SelectedMarker = () => {
  const {
    user, 
    setLoading, 
    setError,
    selected, setSelected,
    setSearchSelected,
    toggle,
    openComments, setOpenComments,
    infoModal, setInfoModal,
    enterAnimation, leaveAnimation,
  } = useContext(Context);

  useEffect(() => {
    setLoading(true);
    const fetchData = async() => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/locations/${selected._id}/all-comments-flavors`)
        const { comments_list, flavors_listed } = await res.json();
        setSelected({
          ...selected,
          comments_list,
          flavors_listed
        })
      } catch (error) {
        setError('Ups, schief gelaufen. Versuche es später nochmal.')
        setTimeout(() => setError(null), 5000);
      }
    }
    fetchData();
    setLoading(false);
  }, [])

  return (
    <IonModal
      cssClass='mapModal'
      isOpen={infoModal} 
      swipeToClose={true} 
      backdropDismiss={true} 
      onDidDismiss={() => {setOpenComments(false); setSelected(null); setInfoModal(false)}} 
      enterAnimation={enterAnimation} 
      leaveAnimation={leaveAnimation}>
      <IonItem lines='full'>
        {user ? <FavLocBtn selectedLoc={selected}/> : null}
        <IonLabel>{selected.name}</IonLabel>
        <IonButton fill="clear" onClick={() => {setOpenComments(false); setSelected(null); setInfoModal(false)}} >
          <IonIcon icon={closeCircleOutline}/>
        </IonButton>
      </IonItem>

      <IonContent>
        {/* IonImg uses lazy loading */}
        <IonImg className="modalImage" src='./assets/ice-cream-truck-vincent-creton-unsplash.jpg' />
        <div style={toggle ? {backgroundColor: '#23303390' } : {backgroundColor: '#ffffff90'}}>
          <IonItemGroup>
            <IonItem className="modalItem" lines="full">
              <IonLabel>
                {selected.address.street} {selected.address.number}
                <br/>
                {selected.address.zipcode} {selected.address.city}
                <br/>
                <a className="websiteLink" href={selected.location_url.includes("http") ? selected.location_url : `//${selected.location_url}`} target="_blank">{selected.location_url}</a>
              </IonLabel>
            </IonItem>
            <IonItem className="modalItem" lines="full">
              <IonLabel>Bewertung schreiben</IonLabel>
              <IonButton 
                onClick={() => {
                  setSearchSelected(selected);
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
            </IonItem>
          </IonItemGroup>
        </div>
      
        <IonCard>
          <div style={{backgroundColor: 'var(--ion-item-background)'}}>          
            {selected.location_rating_quality ? (
              <IonItemGroup>
                <div className="px-3 py-2 borderBottom">
                  <Ratings selectedLoc={selected}/>
                </div>

                {selected.comments_list[0].text && selected.flavors_listed[0].color.primary ? (
                  <>
                    <IonItem color="background-color" className={`${!openComments && 'borderBottom'}`} lines="none">
                      <IonIcon 
                        className="me-2"
                        color="primary" 
                        icon={openComments ? caretDownCircle : caretForwardCircle} 
                        button onClick={() => {
                          setOpenComments(prev => !prev);
                        }}
                      />
                      <IonLabel>Alle Bewertungen</IonLabel>
                      <IonButton 
                        fill="solid" 
                        slot="end"
                        className="ratingNum"
                        onClick={() => setOpenComments(prev => !prev)}
                      >
                        {selected.comments_list.length} 
                      </IonButton>
                    </IonItem>
    
                    {openComments ? selected.comments_list.map(comment => {
                      return (
                        <div key={comment._id}>
                          <IonItem color="background-color" lines="full">
                            <IonLabel className="ion-text-wrap mt-3 ms-1">
                              <p>
                                <IonIcon className="me-2" color={`${toggle ? '' : 'primary'}`} icon={chatboxEllipses}/> {comment.text}
                              </p>
    
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
                            
                              <div className="d-flex align-items-center py-1">
                                <div className="me-2">
                                  <div className="ratingContainer">Veganes Angebot</div>
                                  <div>Eis-Erlebnis</div>
                                </div>
                                <div>
                                  <ReactStars 
                                    count={5}
                                    value={comment.rating_vegan_offer}
                                    isHalf={true}
                                    edit={false}
                                    size={18}
                                    color='#9b9b9b'
                                    activeColor='#de9c01'
                                  />
                                  <ReactStars
                                    count={5}
                                    value={comment.rating_quality}
                                    isHalf={true}
                                    edit={false}
                                    size={18}
                                    color='#9b9b9b'
                                    activeColor='#de9c01'
                                  />
                                </div>
                              </div>
                              <p className="p-weak mt-1">{comment.date.replace('T', ' // ').slice(0, 19)}</p>
                              <p className="p-weak">{`${comment.user_id ? comment.user_id.name : 'Konto inaktiv'}`}</p>
                            </IonLabel>
                          </IonItem>
                        </div>
                      )
                    }) : null}
    
                    <IonItem lines="none">
                      <IonIcon className="me-2" color="primary" icon={iceCream} />
                      <IonLabel>Alle bewerteten Eissorten</IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <div className="d-flex justify-content-around flex-wrap px-3 py-2">
                        {selected.flavors_listed.map(flavor => {
                          return (
                            <div key={flavor._id}>
                              <div className="iceContainer">
                                <div className="icecream" style={{background: `linear-gradient(to bottom, ${flavor.color.primary}, ${flavor.color.secondary ? flavor.color.secondary : flavor.color.primary})`}}></div>
                                <div className="icecreamBottom" style={{background: flavor.color.primary}}></div>
                                <div className="cone"></div>
                              </div>
                              <div className="labelFlavor">{flavor.name}</div>
                            </div>
                            )
                          })
                        }
                      </div>
                    </IonItem>
                  </>
                  ) : null}
                </IonItemGroup>
              ) : (
                <IonItem lines="none">... wartet auf die erste Bewertung</IonItem>
              )}
          </div>
        </IonCard>
        
        <LoadingError />

      </IonContent>
    </IonModal>
  )
}

export default SelectedMarker

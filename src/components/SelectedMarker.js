import { useContext, useEffect } from "react";
import { Context } from '../context/Context';
import { IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonIcon, IonImg, IonItem, IonItemGroup, IonLabel, IonModal } from "@ionic/react";
import ReactStars from "react-rating-stars-component";
import { add, caretDownCircle, caretForwardCircle, closeCircleOutline, iceCream } from "ionicons/icons";
import FavLocBtn from "./FavLocBtn";
import LoadingError from "./LoadingError";

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
        console.log('comments list:', comments_list)
        console.log('flavors_listed:', flavors_listed)
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
        {user ? <FavLocBtn /> : null}
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
              <IonLabel color="text-color">
                {selected.address.street} {selected.address.number}, {selected.address.zipcode} {selected.address.city}
                <br/>
                <a href={selected.location_url} target="_blank">Webseite</a>
              </IonLabel>
            </IonItem>
            <IonItem className="modalItem" lines="full">
              <IonLabel color='primary'>Bewertung schreiben</IonLabel>
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
          <div style={toggle ? {backgroundColor: '#233033' } : {backgroundColor: '#fff'}}>          
            <IonItemGroup>
              <IonItem className="d-flex modalItem" lines="full">
                {selected.location_rating_quality ? (
                  <div className="pe-3 py-2">Eis-Qualität
                    <ReactStars
                      count={5}
                      value={selected.location_rating_quality}
                      edit={false}
                      size={18}
                      color='#9b9b9b'
                      activeColor='#de9c01'
                    />
                  </div>
                ) : null}
                {selected.location_rating_quality ? (
                  <div className="py-2">Veganes Angebot
                    <ReactStars 
                      count={5}
                      value={selected.location_rating_vegan_offer}
                      edit={false}
                      size={18}
                      color='#9b9b9b'
                      activeColor='#de9c01'
                    />
                  </div>
              ) : (
                <p>Noch keine Bewertungen vorhanden</p>
              )}
              </IonItem>
              <IonItem lines="none">
                <IonIcon className="me-2" color="primary" icon={iceCream} />
                <IonLabel>Alle bewerteten Eissorten</IonLabel>
              </IonItem>
              <IonItem lines="full">
                <div className="d-flex justify-content-around flex-wrap px-3 py-2">
                {selected.flavors_listed ? selected.flavors_listed.map(flavor => {
                  return (
                    <div key={flavor._id}>
                      <div className="iceContainer">
                        <div className="icecream" style={{background: `linear-gradient(to bottom, ${flavor.ice_color.color_primary}, ${flavor.ice_color.color_secondary} )`}}></div>
                        <div className="icecreamBottom" style={{background: flavor.ice_color.color_primary}}></div>
                        <div className="cone"></div>
                      </div>
                      <div className="p-weak text-center">{flavor.name}</div>
                    </div>
                  )}
                  ) : null}
                  </div>
              </IonItem>
              
              {selected.comments_list.length > 0 ? (
                <IonItem color="background-color" lines="none">
                  <IonIcon 
                    className="me-2"
                    color="primary" 
                    icon={openComments ? caretDownCircle : caretForwardCircle} 
                    button onClick={() => {
                      setOpenComments(prev => !prev);
                    }}
                  />
                  <IonLabel className="ms-1">Alle Bewertungen anzeigen</IonLabel>
                  <IonButton disabled fill="solid" className="disabled-btn my-3">
                    {selected.comments_list.length} 
                  </IonButton>
                </IonItem>
              ) : null}
              {openComments ? selected.comments_list.map((comment, i) => {
                return (
                  <>
                    <IonItem color="background-color" lines="none">
                      <IonLabel>{i+1}. Bewertung</IonLabel>
                    </IonItem>
                    <IonItem key={comment._id} color="background-color" lines="full">
                      <IonLabel className="ion-text-wrap mt-0 ms-1">
                      <p>{comment.text}</p>
                      
                      <div className="d-flex align-items-center">
                        {comment.flavors_referred.map(flavor => {
                          return (
                            <IonButton key={flavor._id} disabled fill="solid" className="disabled-btn my-3">
                              <IonIcon color={`${toggle ? "warning" : "secondary"}`} className="pe-1" icon={iceCream} />
                              {flavor.name}
                            </IonButton>
                            )
                          })
                        }
                      </div>
                    
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
                      <p className="p-weak">User: {comment.user_id.name}</p>
                    </IonLabel>
                  </IonItem>
                </>
                )
              }
              ) : null}
            </IonItemGroup>
          </div>
        </IonCard>
        
        <LoadingError />

      </IonContent>
    </IonModal>
  )
}

export default SelectedMarker

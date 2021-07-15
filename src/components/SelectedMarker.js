import { useContext, useEffect } from "react";
import { Context } from '../context/Context';
import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonItem, IonItemGroup, IonLabel, IonModal, isPlatform } from "@ionic/react";
import { add, caretDownCircle, caretForwardCircle, chatboxEllipses, closeCircleOutline, iceCream } from "ionicons/icons";
import BtnFavLoc from "./Comments/BtnFavLoc";
import LoadingError from "./LoadingError";
import Ratings from "./Ratings";
import CommentsBlock from "./Comments/CommentsBlock";
import FlavorsBlock from "./FlavorsBlock";

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
        {user ? <BtnFavLoc selectedLoc={selected}/> : null}
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
              {selected.pricing.length > 0 && (
                <div className="pricingInfo">
                  Eiskugel {selected.pricing[selected.pricing.length-1].toFixed(2).replace(/\./g, ',')} €
                </div>
              )}
            </IonItem>

            <IonItem
              button
              onClick={() => {
                setSearchSelected(selected);
                setOpenComments(false);
                setSelected(null);
                setInfoModal(false);
              }} 
              routerLink="/preis" 
              routerDirection="forward"
              className="modalItemSmall itemTextSmall" 
              lines="full"
              detail="false"
            >
              <IonLabel>{selected.pricing.length === 0 ? 'Kugelpreis eintragen' : 'Kugelpreis aktualisieren'}</IonLabel>
              <IonButton 
                fill="clear" 
              >
                <IonIcon icon={add}/>
              </IonButton>
            </IonItem>

            <IonItem 
              button
              onClick={() => {
                setSearchSelected(selected);
                setOpenComments(false);
                setSelected(null);
                setInfoModal(false);
              }} 
              routerLink="/bewerten" 
              routerDirection="forward"
              className="modalItemSmall itemTextSmall" 
              lines="full"
              detail="false"
            >
              <IonLabel>Bewerten</IonLabel>
              <IonButton 
                fill="clear"
              >
                <IonIcon icon={add}/>
              </IonButton>
            </IonItem>
          </IonItemGroup>
        </div>
      
        <IonCard className={`${isPlatform('desktop') ? "cardIonic" : ""}`}>
          <div style={{backgroundColor: 'var(--ion-item-background)'}}>          
            {selected.comments_list.length ? (
              <IonItemGroup>
                <div className="px-3 py-1 borderBottom">
                  <Ratings 
                    rating_vegan_offer={selected.location_rating_vegan_offer}
                    rating_quality={selected.location_rating_quality}
                    showNum={true}
                  />
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
                      <IonLabel>Bewertungen</IonLabel>
                      <IonButton 
                        fill="solid"
                        className="commentNum"
                        onClick={() => setOpenComments(prev => !prev)}
                      >
                        {selected.comments_list.length} 
                      </IonButton>
                    </IonItem>
    
                    {openComments ? selected.comments_list.map(comment => <CommentsBlock comment={comment} key={comment._id} />) : null}
    
                    <IonItem lines="none">
                      <IonIcon className="me-2" color="primary" icon={iceCream} />
                      <IonLabel>Bewertete Eissorten</IonLabel>
                    </IonItem>
                    
                    <FlavorsBlock flavorsList={selected.flavors_listed} />                    
                    
                  </>
                  ) : null}
                </IonItemGroup>
              ) : (
                <IonItem 
                  button
                  onClick={() => {
                    setSearchSelected(selected);
                    setOpenComments(false);
                    setSelected(null);
                    setInfoModal(false);
                  }} 
                  routerLink="/bewerten" 
                  routerDirection="forward"
                  className="itemTextSmall"
                  lines="none"
                  detail="false"
                >... wartet auf die erste Bewertung</IonItem>
              )}
          </div>
        </IonCard>
        
        <LoadingError />

      </IonContent>
    </IonModal>
  )
}

export default SelectedMarker

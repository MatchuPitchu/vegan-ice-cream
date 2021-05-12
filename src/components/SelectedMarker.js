import { useContext, useState, useEffect } from "react";
import { Context } from '../context/Context';
import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonIcon, IonImg, IonItem, IonItemGroup, IonLabel, IonLoading, IonToast, isPlatform } from "@ionic/react";
import ReactStars from "react-rating-stars-component";
import { add, caretDownCircle, caretForwardCircle } from "ionicons/icons";

const SelectedMarker = () => {
  const { 
    loading, setLoading, 
    error, setError,
    selected, setSelected,
    toggle,
    openComments, setOpenComments
  } = useContext(Context);

  useEffect(() => {
    setLoading(true);
    const fetchData = async() => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/locations/${selected._id}/all-comments-flavors`)
        const {comments_list, flavors_listed} = await res.json();
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
            <IonButton fill="clear" routerLink="/bewerten" routerDirection="forward">
              <IonIcon icon={add}/>
            </IonButton>
          </IonItem>
        </IonItemGroup>
      </div>
    
      <IonCard>
        <div style={toggle ? {backgroundColor: '#233033' } : {backgroundColor: '#fff'}}>
          <IonItemGroup>
            <IonItem className="modalItem" lines="none">
              <IonLabel color='primary'>Bewertungen</IonLabel>
            </IonItem>
            <IonItem className="row modalItem" lines="full">
              {selected.location_rating_quality ? (
                <div className="col-auto my-2">Eis-Qualität
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
                <div className="col-auto my-2">Veganes Angebot
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
              <IonIcon 
                color="primary" 
                icon={openComments ? caretDownCircle : caretForwardCircle} 
                button onClick={() => {
                  setOpenComments(prev => !prev);
                }}
              />
              <IonLabel className="ms-1">Alle anzeigen</IonLabel>
            </IonItem>
            {openComments ? selected.comments_list.map((comment, i) => {
              return (
              <IonItem key={comment._id} lines="full">
                <IonLabel className="ion-text-wrap ms-1">
                  {i+1}. Bewertung
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
                  <p className="p-weak">Autor: {comment.user_id.name}</p>
                </IonLabel>

              </IonItem>
              )
            }
            ) : null}
          </IonItemGroup>
        </div>
      </IonCard>
      
      <IonLoading 
        isOpen={loading ? true : false} 
        message={"Einen Moment bitte ..."}
        onDidDismiss={() => setLoading(false)}
      />
      <IonToast
        color='danger'
        isOpen={error ? true : false} 
        message={error} 
        onDidDismiss={() => setError(null)}
        duration={6000} 
      />
    </IonContent>
  )
}

export default SelectedMarker

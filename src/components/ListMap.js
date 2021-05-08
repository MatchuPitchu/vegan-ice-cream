import { useContext, useState, useCallback, useRef } from "react";
import { Context } from '../context/Context';
import ReactStars from "react-rating-stars-component";
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonModal, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonToast, IonToggle, IonToolbar } from '@ionic/react';
import { add, addCircleOutline, closeCircleOutline, listCircle, location as myPos, mailUnread, map as mapIcon, refreshCircle, removeCircleOutline } from "ionicons/icons";


const ListMap = () => {
  const { 
    locations, 
    disableInfScroll, 
    loadMore, 
  } = useContext(Context);
  
  return (
    <IonContent>
      {locations && locations.map((loc) => (
        <IonCard key={loc._id} >
          <IonItem lines="full">
            <IonAvatar slot='start'>
              <img src='./assets/icons/ice-cream-icon-dark.svg' />
            </IonAvatar>
            <IonLabel >
              {loc.name}
              <p>{loc.address.street} {loc.address.number}</p>
              <p className="mb-2">{loc.address.zipcode} {loc.address.city}</p>
              <p><a href={loc.location_url}>Webseite</a></p>
            </IonLabel>
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
      {/* Infinite Scroll Ionic React: https://dev.to/daviddalbusco/infinite-scroll-with-ionic-react-3a3i */}
      <IonInfiniteScroll threshold="25%" disabled={disableInfScroll} onIonInfinite={(e) => loadMore(e)}>
        <IonInfiniteScrollContent loadingSpinner="dots" loadingText="Loading more locations ...">
        </IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>
  )
};

export default ListMap;

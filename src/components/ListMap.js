import { useContext, useState, useCallback, useRef } from "react";
import { Context } from '../context/Context';
import ReactStars from "react-rating-stars-component";
import { IonAlert, IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonModal, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonToast, IonToggle, IonToolbar } from '@ionic/react';
import { add, addCircleOutline, bookmarks, bookmarksOutline, caretForwardCircle, closeCircleOutline, listCircle, location as myPos, mailUnread, map as mapIcon, open, refreshCircle, removeCircleOutline } from "ionicons/icons";
import SelectedMarker from './SelectedMarker';

const ListMap = () => {
  const { 
    loading, setLoading, 
    error, setError,
    locations, 
    disableInfScroll, 
    loadMore,
    user,
    selected, setSelected,
    enterAnimation, leaveAnimation, 
    showMapModal, setShowMapModal,
    alertUpdateFav, setAlertUpdateFav,
    addFavLoc,
    removeFavLoc
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
              <p><a href={loc.location_url} target="_blank">Webseite</a></p>
            </IonLabel>
          </IonItem>
          
          <IonCardContent>
            <IonCardSubtitle color='primary'>Bewertung der Community</IonCardSubtitle>
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

            <IonButton 
              className="more-infos" 
              title="Mehr Infos" 
              onClick={() => { 
                setSelected(loc); 
                setShowMapModal(true) 
              }}
            >
              <IonIcon icon={open} />
            </IonButton>
          </IonCardContent>
          
        </IonCard>
      ))}

      {selected ? (
        <div>
          <IonModal cssClass='mapModal' isOpen={showMapModal} swipeToClose={true} backdropDismiss={true} onDidDismiss={() => setShowMapModal(false)} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
            <IonItem lines='full'>
              {user && user.favorite_locations.find(loc => loc._id === selected._id) ? (
                <IonButton fill="clear" onClick={() => setAlertUpdateFav({...alertUpdateFav, removeStatus: true, location: selected})}>
                  <IonIcon icon={bookmarks}/>
                  <IonBadge slot="end" color="danger">-</IonBadge>
                </IonButton>
                ) : null}
              {user && user.favorite_locations.find(loc => loc._id === selected._id) ? (
                <IonButton fill="clear" onClick={() => setAlertUpdateFav({...alertUpdateFav, addStatus: true, location: selected})}>
                  <IonIcon icon={bookmarksOutline}/>
                  <IonBadge slot="end" color="success">+</IonBadge>  
                </IonButton>
              ) : null }
              <IonAlert
                isOpen={alertUpdateFav.addStatus}
                onDidDismiss={() => setAlertUpdateFav({...alertUpdateFav, addStatus: false })}
                header={'Favoriten hinzufügen'}
                message={'Möchtest du den Eisladen deinen Favoriten hinzufügen?'}
                buttons={[
                  { text: 'Abbrechen', role: 'cancel' },
                  { text: 'Bestätigen', handler: addFavLoc }
                ]}
              />
              <IonAlert
                isOpen={alertUpdateFav.removeStatus}
                onDidDismiss={() => setAlertUpdateFav({...alertUpdateFav, removeStatus: false })}
                header={'Favoriten entfernen'}
                message={'Möchtest du den Eisladen wirklich von deiner Liste entfernen?'}
                buttons={[
                  { text: 'Abbrechen', role: 'cancel' },
                  { text: 'Bestätigen', handler: removeFavLoc }
                ]}
              />

              <IonLabel>{selected.name}</IonLabel>
              <IonButton fill="clear" onClick={() => setShowMapModal(false)}>
                <IonIcon icon={closeCircleOutline }/>
              </IonButton>
            </IonItem>
            <SelectedMarker />
          </IonModal>
        </div>
      ) : null}

      {/* Infinite Scroll Ionic React: https://dev.to/daviddalbusco/infinite-scroll-with-ionic-react-3a3i */}
      <IonInfiniteScroll threshold="25%" disabled={disableInfScroll} onIonInfinite={(e) => loadMore(e)}>
        <IonInfiniteScrollContent loadingSpinner="dots" loadingText="Loading more locations ...">
        </IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>
  )
};

export default ListMap;

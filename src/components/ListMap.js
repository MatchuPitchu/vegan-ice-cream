import { useContext } from "react";
import { Context } from '../context/Context';
import ReactStars from "react-rating-stars-component";
import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel } from '@ionic/react';
import SelectedMarker from './SelectedMarker';
import { open } from "ionicons/icons";

const ListMap = () => {
  const { 
    locationsList,
    listResults,
    disableInfScroll, 
    loadMore,
    selected, setSelected,
    setInfoModal,
    setOpenComments,
  } = useContext(Context);

  console.log(locationsList)

  return (
    <IonContent>
      {listResults.length ? listResults.map(loc => (
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
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <div className="ratingContainer">Eis-Erlebnis</div>
                  <div>Veganes Angebot</div>
                </div>
                <div>
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
              </div>
            ) : (
              <p>Noch keine Bewertungen vorhanden</p>
            )}  

            <IonButton 
              className="more-infos mt-2" 
              title="Mehr Infos"
              onClick={() => {
                setOpenComments(false);
                setSelected(loc); 
                setInfoModal(true) 
              }}
            >
              <IonIcon className="me-1" icon={open} />Mehr Infos
            </IonButton>
          </IonCardContent>
        </IonCard>
      )) : null}

      {locationsList && !listResults.length ? locationsList.map(loc => (
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
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <div className="ratingContainer">Eis-Erlebnis</div>
                  <div>Veganes Angebot</div>
                </div>
                <div>
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
              </div>
            ) : (
              <p>Noch keine Bewertungen vorhanden</p>
            )}  

            <IonButton 
              className="more-infos mt-2" 
              title="Mehr Infos"
              onClick={() => {
                setOpenComments(false);
                setSelected(loc); 
                setInfoModal(true) 
              }}
            >
              <IonIcon className="me-1" icon={open} />Mehr Infos
            </IonButton>
          </IonCardContent>
          
        </IonCard>
      )) : null}

      {selected ? <SelectedMarker /> : null}

      {/* Infinite Scroll Ionic React: https://dev.to/daviddalbusco/infinite-scroll-with-ionic-react-3a3i */}
      {!listResults.length && (
        <IonInfiniteScroll threshold="20%" disabled={disableInfScroll} onIonInfinite={(e) => loadMore(e)}>
          <IonInfiniteScrollContent loadingSpinner="dots">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
      )}

    </IonContent>
  )
};

export default ListMap;

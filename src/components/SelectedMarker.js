import { useContext } from "react";
import { Context } from '../context/Context';
import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonIcon, IonImg, IonItem, IonItemGroup, IonLabel, isPlatform } from "@ionic/react";
import ReactStars from "react-rating-stars-component";
import { add } from "ionicons/icons";

const SelectedMarker = () => {
  const { selected, toggle } = useContext(Context);

  console.log(selected)

  return (
    <IonContent>
      {/* IonImg uses lazy loading */}
      <IonImg className="modalImage" src='./assets/shapes.svg' />
      <div style={toggle ? {backgroundColor: '#233033' } : {backgroundColor: '#fff'}}>
        <IonItemGroup>
          <IonItem className="modalItem" lines="full">
            <IonLabel color="text-color">
              {selected.address.street} {selected.address.number}, {selected.address.zipcode} {selected.address.city}
              <br/>
              <a href={selected.location_url}>Webseite</a>
            </IonLabel>
          </IonItem>
          <IonItem className="modalItem" lines="full">
            <IonLabel color='primary'>Bewertung schreiben</IonLabel>
            <IonButton fill="clear" onClick={() => { }}>
              <IonIcon icon={add}/>
            </IonButton>
          </IonItem>
        </IonItemGroup>
      </div>
    
      <IonCard>
        <IonCardContent>
          <IonCardSubtitle color='primary'>Bewertungen</IonCardSubtitle>
          {selected.location_rating_quality ? (
            <>
              <div className="d-flex align-items-center">
                <div className="me-2">Qualität</div>
                <div>
                  <ReactStars
                    count={5}
                    value={selected.location_rating_quality}
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
                    value={selected.location_rating_vegan_offer}
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

          BEWERTUNGEN MIT KLICK HIER AUFKLAPPBAR UND ZU LESEN
        </IonCardContent>
      </IonCard>
    </IonContent>
  )
}

export default SelectedMarker

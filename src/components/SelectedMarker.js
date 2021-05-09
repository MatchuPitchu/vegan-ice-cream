import { useContext, useState } from "react";
import { Context } from '../context/Context';
import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonIcon, IonImg, IonItem, IonItemGroup, IonLabel, isPlatform } from "@ionic/react";
import ReactStars from "react-rating-stars-component";
import { add, caretDownCircle, caretForwardCircle } from "ionicons/icons";

const SelectedMarker = () => {
  const { selected, toggle } = useContext(Context);
  const [ openComments, setOpenComments ] = useState(false);

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
        <div style={toggle ? {backgroundColor: '#233033' } : {backgroundColor: '#fff'}}>
          <IonItemGroup>
            <IonItem className="modalItem" lines="none">
              <IonLabel color='primary'>Bewertungen</IonLabel>
            </IonItem>
            <IonItem className="row modalItem" lines="full">
              {selected.location_rating_quality && (
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
              )}
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
              <IonIcon color="primary" icon={openComments ? caretDownCircle : caretForwardCircle} button onClick={() => setOpenComments(prev => !prev)}></IonIcon>
              <IonLabel className="ms-1">Alle anzeigen</IonLabel>
            </IonItem>
            {openComments && (
            <IonItem lines="none">
              <IonLabel className="ms-1">Alle anzeigen</IonLabel>
            </IonItem>
            )}
          </IonItemGroup>
        </div>
      </IonCard>
    </IonContent>
  )
}

export default SelectedMarker

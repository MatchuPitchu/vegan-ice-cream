import { useContext } from "react";
import { Context } from '../context/Context';
import ReactStars from "react-rating-stars-component";
import { IonSlide, IonCard, IonAvatar, IonLabel, IonCardContent, IonCardSubtitle, IonItem, IonButton, IonIcon } from '@ionic/react';
import { open, sunny } from "ionicons/icons";
import SelectedMarker from "./SelectedMarker";

// Optional parameters to pass to the swiper instance.
// See http://idangero.us/swiper/api/ for valid options.

const TopLocations = () => {
  const {
    topLocations,
    selected, setSelected,
    setInfoModal,
    setOpenComments
  } = useContext(Context);

  return topLocations.length && topLocations.map((loc, i) => (
      <IonSlide
        key={loc._id}
        className="text-start"
      >
        <div>
          <IonButton className="slideBtn">
            {i+1}.
          </IonButton>
          <IonCard className="slideCard">       
            <IonItem lines="full">
              <IonLabel>
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
                    <div className="ratingContainer">Veganes Angebot</div>
                    <div>Eis-Erlebnis</div>
                  </div>
                  <div>
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
                </div>
              ) : (
                <div>Noch keine Bewertungen vorhanden</div>
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
        </div>

        {selected ? <SelectedMarker /> : null}
      
      </IonSlide>
      )
    )
};

export default TopLocations;
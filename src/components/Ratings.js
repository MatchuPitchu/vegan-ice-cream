import { IonButton } from "@ionic/react";
import ReactStars from "react-rating-stars-component";

const Ratings = ({selectedLoc}) => (
  <div className="d-flex align-items-center py-1">
    <div className="me-2">
      <div className="ratingContainer">Veganes Angebot</div>
      <div>Eis-Erlebnis</div>
    </div>
    <div>
      <ReactStars 
        count={5}
        value={selectedLoc.location_rating_vegan_offer}
        isHalf={true}
        edit={false}
        size={18}
        color='#9b9b9b'
        activeColor='#de9c01'
      />
      <ReactStars
        count={5}
        value={selectedLoc.location_rating_quality}
        isHalf={true}
        edit={false}
        size={18}
        color='#9b9b9b'
        activeColor='#de9c01'
      />
    </div>
    <div className="ms-2 d-flex flex-column">
      <IonButton disabled fill="solid" className="ratingNum">
        {selectedLoc.location_rating_vegan_offer}
      </IonButton>
      <IonButton disabled fill="solid" className="ratingNum">
        {selectedLoc.location_rating_quality}
      </IonButton>
    </div>
  </div>
)

export default Ratings

import { IonButton } from "@ionic/react";
import ReactStars from "react-rating-stars-component";

const Ratings = ({rating_vegan_offer, rating_quality}) => (
  <div className="d-flex align-items-center py-1 itemTextSmall">
    <div className="me-2">
      <div className="ratingContainer">Veganes Angebot</div>
      <div>Eis-Erlebnis</div>
    </div>
    <div>
      <ReactStars 
        count={5}
        value={rating_vegan_offer}
        isHalf={true}
        edit={false}
        size={18}
        color='#9b9b9b'
        activeColor='#de9c01'
      />
      <ReactStars
        count={5}
        value={rating_quality}
        isHalf={true}
        edit={false}
        size={18}
        color='#9b9b9b'
        activeColor='#de9c01'
      />
    </div>
    <div className="ms-auto d-flex flex-column">
      <IonButton disabled fill="solid" className="ratingNum">
        {rating_vegan_offer}
      </IonButton>
      <IonButton disabled fill="solid" className="ratingNum">
        {rating_quality}
      </IonButton>
    </div>
  </div>
)

export default Ratings

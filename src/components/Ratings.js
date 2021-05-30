import ReactStars from "react-rating-stars-component";

const Ratings = ({selectedLoc}) => (
  <div className="d-flex align-items-center py-1">
      <div className="me-2">
        <div className="ratingContainer">Veganes Angebot</div>
        <div>Eis-Erlebnis</div>
      </div>
      <div>
        <div>
          <ReactStars 
            count={5}
            value={selectedLoc.location_rating_vegan_offer}
            edit={false}
            size={18}
            color='#9b9b9b'
            activeColor='#de9c01'
          />
        </div>
        <div>
          <ReactStars
            count={5}
            value={selectedLoc.location_rating_quality}
            edit={false}
            size={18}
            color='#9b9b9b'
            activeColor='#de9c01'
          />
        </div>
      </div>
    </div>
)

export default Ratings

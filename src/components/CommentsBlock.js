import { useContext } from "react";
import { Context } from '../context/Context';
import { IonIcon } from '@ionic/react'
import { chatboxEllipses, iceCream } from 'ionicons/icons'
import Ratings from './Ratings'

const CommentsBlock = ({comment}) => {
  const {
    toggle,
  } = useContext(Context);

  return (
    <div key={comment._id} className="px-3 py-2 borderBottom">
      <div className="commentText">
        <IonIcon className="me-2" color={`${toggle ? '' : 'primary'}`} icon={chatboxEllipses}/> {comment.text}
      </div>
      <Ratings 
        rating_vegan_offer={comment.rating_vegan_offer}
        rating_quality={comment.rating_quality}
        showNum={false}
      />
      {comment.flavors_referred.map(flavor => {
        return (
          <div key={flavor._id} className="flavor-btn mt-2 d-flex align-items-center justify-content-center">
            <IonIcon className="coneIcon pe-1" size="small" icon={iceCream} />
            {flavor.name}
          </div>
          )
        })
      }
      <div className="textSmallGrey mt-2">{comment.date.replace('T', ' um ').slice(0, 19)} Uhr von {`${comment.user_id ? comment.user_id.name : 'Konto deaktiviert'}`}</div>      
    </div>
  )
}

export default CommentsBlock

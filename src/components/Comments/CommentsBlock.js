import { useContext } from "react";
import { Context } from '../../context/Context';
import { IonIcon } from '@ionic/react'
import { chatboxEllipses, iceCream } from 'ionicons/icons'
import Ratings from '../Ratings'
import BtnEditDelete from "./BtnEditDelete";
import UpdateComment from "./UpdateComment";

const CommentsBlock = ({comment}) => {
  const { user, showUpdateComment } = useContext(Context);

  // if user clicks on edit btn than updateComment component is displayed
  return showUpdateComment.comment_id !== comment._id ? (
    <div className="px-3 py-2 borderBottom">
      <div className="commentText">
        <IonIcon slot="start" className="me-2" color='text-color' icon={chatboxEllipses}/>{comment.text}
      </div>
      {(comment.bio || comment.vegan || comment.lactose_free) && (
        <div className="d-flex mt-3">
          {comment.bio ? (<div className="commentTag">bio</div>) : null}
          {comment.vegan ? (<div className="commentTag">vegan</div>) : null}
          {comment.lactose_free ? (<div className="commentTag">laktosefrei</div>) : null}
        </div>
      )}
      <div className="d-flex align-items-center">
        <Ratings
          rating_vegan_offer={comment.rating_vegan_offer}
          rating_quality={comment.rating_quality}
          showNum={false}
        />
        
        {/* Displays buttons a) if user has not deactivated his account and b) if user is author of comment */}
        {/* ID is in comment.user_id in profil; ID is in comment.user_id._id in selected  */}
        {comment.user_id && (user._id === comment.user_id || user._id === comment.user_id._id ? <BtnEditDelete comment={comment} /> : null)}

      </div>
      {comment.flavors_referred.map(flavor => {
        return (
          <div key={flavor._id} className="flavor-btn mt-2 d-flex align-items-center justify-content-center">
            <IonIcon className="coneIcon pe-1" size="small" icon={iceCream} />
            {flavor.name}
          </div>
          )
        })
      }
      {/* If user_id exists (so user account is not deleted), than check if user_id.name is there, if not than it's the profil section and I can user user.name */}
      <div className="textSmallGrey mt-2">{`${comment.user_id ? (comment.user_id.name !== undefined ? comment.user_id.name : user.name) : 'User mit deaktiviertem Konto'}`} am {comment.date.replace('T', ' um ').slice(0, 19)} Uhr</div>      
    </div>
  ) : (
    <UpdateComment comment={comment} />
  )
}

export default CommentsBlock

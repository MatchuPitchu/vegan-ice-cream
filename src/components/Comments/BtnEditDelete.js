import { useContext, useState} from "react";
import { Context } from "../../context/Context";
import { IonActionSheet, IonButton, IonIcon } from "@ionic/react";
import { close, createOutline, trashOutline } from "ionicons/icons";

const BtnEditDelete = ({comment}) => {
  const { 
    user, setUser,
    selected, setSelected,
    setShowUpdateComment
  } = useContext(Context)

  const [showActionSheet, setShowActionSheet] = useState(false);

  const deleteComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token
        },
        // converts JS data into JSON string.
        body: JSON.stringify({ user_id: user._id }),
        credentials: "include"
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${comment._id}`, options);
      if(res.status === 200) {
        if(selected) {
          // remove deleted comment from selected comments list array
          const newList = selected.comments_list.filter(item => item._id !== comment._id);

          // if list exists after removing than calc new avg ratings without fetching data from API - rounded to one decimal
          if(newList.length) {
            // if length list = 1 than take directly rating
            const sumQuality = newList.length === 1 ? newList[0].rating_quality : newList.reduce((a, b) => a.rating_quality + b.rating_quality);
            const sumVegan = newList.length === 1 ? newList[0].rating_vegan_offer : newList.reduce((a, b) => a.rating_vegan_offer + b.rating_vegan_offer);
            const location_rating_quality = Math.round( (sumQuality / newList.length) * 10) / 10 || 0;
            const location_rating_vegan_offer = Math.round( (sumVegan / newList.length) * 10) / 10 || 0;
            setSelected({...selected, comments_list: newList, location_rating_quality, location_rating_vegan_offer});
          } else {
            setSelected({...selected, comments_list: []});
          }
        }
  
        // remove deleted comment from user profil comments list array
        const newUserList = user.comments_list.filter(item => item._id !== comment._id);
        setUser({...user, comments_list: newUserList})
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      {/* edit comment btn */}
      <IonButton
        fill="clear"
        className="smallBtn ms-auto"
        onClick={() => setShowUpdateComment({ state: true, comment_id: comment._id })}
      >
        <IonIcon className="me-0" size="small" icon={createOutline} />
      </IonButton>

      {/* delete comment btn */}
      <IonButton
        fill="clear"
        className="smallBtn"
        onClick={() => setShowActionSheet(true)}
      >
        <IonIcon className="me-0" size="small" icon={trashOutline} />
      </IonButton>
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        cssClass='actionSheet'
        keyboardClose
        header="Möchtest du deine Bewertung wirklich unwiderruflich löschen?"
        buttons={
          [{
            text: 'Löschen',
            role: 'destructive',
            icon: trashOutline,
            handler: () => deleteComment(),
          },
          {
            text: 'Abbrechen',
            role: 'cancel',
            icon: close,
            cssClass: 'cancelBtn'
          }]
        }
      >
      </IonActionSheet>
    </>
  )
}

export default BtnEditDelete

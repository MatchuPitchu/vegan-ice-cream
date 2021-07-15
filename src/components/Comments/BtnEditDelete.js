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
        // remove deleted comment from selected comments list array
        if(selected) {
          const newSelectedList = selected.comments_list.filter(item => item._id !== comment._id);
          setSelected({...selected, comments_list: newSelectedList})
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
      {/* edit comment functionality */}
      <IonButton
        fill="clear"
        className="smallBtn ms-auto"
        onClick={() => setShowUpdateComment({ state: true, comment_id: comment._id })}
      >
        <IonIcon className="me-0" size="small" icon={createOutline} />
      </IonButton>

      {/* delete comment functionality */}
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

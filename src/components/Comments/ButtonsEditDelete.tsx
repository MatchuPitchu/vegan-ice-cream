import { useState, VFC } from 'react';
import type { Comment } from '../../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { showActions } from '../../store/showSlice';
import { getSelectedLocation, locationsActions } from '../../store/locationsSlice';
import { userActions } from '../../store/userSlice';
import { appActions } from '../../store/appSlice';
import { IonActionSheet, IonButton, IonIcon } from '@ionic/react';
import { close, createOutline, trashOutline } from 'ionicons/icons';

type Props = {
  comment: Comment;
};

const ButtonsEditDelete: VFC<Props> = ({ comment }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const selectedLocation = useAppSelector(getSelectedLocation);

  const [showActionSheet, setShowActionSheet] = useState(false);

  // delete comment, update user and selected location data, calculate new rating averages to display them immediately
  const deleteComment = async (comment: Comment) => {
    dispatch(appActions.setIsLoading(true));
    const token = localStorage.getItem('token');
    if (!user) return;
    if (!token) return;

    try {
      const options: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        // converts JS data into JSON string.
        body: JSON.stringify({ user_id: user._id }),
        credentials: 'include',
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${comment._id}`, options);
      if (res.status === 200) {
        if (selectedLocation) {
          dispatch(locationsActions.deleteCommentFromSelectedLocation(comment._id));
        }
        dispatch(userActions.deleteCommentFromUser(comment._id));
      }
    } catch (err: any) {
      console.log(err.message);
    }
    dispatch(appActions.setIsLoading(false));
  };

  return (
    <>
      {/* edit comment btn */}
      <IonButton
        fill='clear'
        className='smallBtn ms-auto'
        onClick={() =>
          dispatch(showActions.setShowEditSectionComment({ state: true, comment_id: comment._id }))
        }
      >
        <IonIcon className='me-0' size='small' icon={createOutline} />
      </IonButton>

      {/* delete comment btn */}
      <IonButton fill='clear' className='smallBtn' onClick={() => setShowActionSheet(true)}>
        <IonIcon className='me-0' size='small' icon={trashOutline} />
      </IonButton>
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        cssClass='actionSheet'
        keyboardClose
        header='Möchtest du deine Bewertung wirklich unwiderruflich löschen?'
        buttons={[
          {
            text: 'Löschen',
            role: 'destructive',
            icon: trashOutline,
            handler: () => deleteComment(comment),
          },
          {
            text: 'Abbrechen',
            role: 'cancel',
            icon: close,
            cssClass: 'cancelBtn',
          },
        ]}
      ></IonActionSheet>
    </>
  );
};

export default ButtonsEditDelete;

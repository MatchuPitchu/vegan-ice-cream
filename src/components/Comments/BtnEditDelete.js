import { useState } from 'react';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { showActions } from '../../store/showSlice';
import { getSelectedLocation, locationsActions } from '../../store/locationsSlice';
import { userActions } from '../../store/userSlice';
import { appActions } from '../../store/appSlice';
// Context
import { IonActionSheet, IonButton, IonIcon } from '@ionic/react';
import { close, createOutline, trashOutline } from 'ionicons/icons';

const BtnEditDelete = ({ comment }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const selectedLocation = useAppSelector((state) => getSelectedLocation(state.locations));

  const [showActionSheet, setShowActionSheet] = useState(false);

  // delete comment, update user and selected location data, calculate new rating averages to display them immediately
  const deleteComment = async (comment) => {
    dispatch(appActions.setIsLoading(true));

    try {
      const token = localStorage.getItem('token');
      const options = {
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
          // remove deleted comment from selected comments list array
          const newList = selectedLocation.comments_list.filter((item) => item._id !== comment._id);

          // if list exists after removing than calc new avg ratings without fetching data from API - rounded to one decimal
          if (newList.length) {
            // if length list = 1 than take directly rating
            const sumQuality =
              newList.length === 1
                ? newList[0].rating_quality
                : newList.reduce((a, b) => a.rating_quality + b.rating_quality);
            const sumVegan =
              newList.length === 1
                ? newList[0].rating_vegan_offer
                : newList.reduce((a, b) => a.rating_vegan_offer + b.rating_vegan_offer);
            const location_rating_quality =
              Math.round((sumQuality / newList.length) * 10) / 10 || 0;
            const location_rating_vegan_offer =
              Math.round((sumVegan / newList.length) * 10) / 10 || 0;

            dispatch(
              locationsActions.updateSelectedLocation({
                comments_list: newList,
                location_rating_quality,
                location_rating_vegan_offer,
              })
            );
          } else {
            dispatch(
              locationsActions.updateSelectedLocation({
                comments_list: [],
              })
            );
          }
        }

        // remove deleted comment from user profil comments list array
        const newUserList = user.comments_list.filter((item) => item._id !== comment._id);
        dispatch(userActions.updateUser({ comments_list: newUserList }));
        // setUser({ ...user, comments_list: newUserList });
      }
    } catch (err) {
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
          dispatch(showActions.setShowUpdateComment({ state: true, comment_id: comment._id }))
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

export default BtnEditDelete;

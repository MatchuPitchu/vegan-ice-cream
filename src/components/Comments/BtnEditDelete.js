import { useContext, useState } from 'react';
// Redux Store
import { useAppDispatch } from '../../store/hooks';
import { showActions } from '../../store/showSlice';
// Context
import { Context } from '../../context/Context';
import { IonActionSheet, IonButton, IonIcon } from '@ionic/react';
import { close, createOutline, trashOutline } from 'ionicons/icons';

const BtnEditDelete = ({ comment }) => {
  const dispatch = useAppDispatch();
  const { deleteComment } = useContext(Context);

  const [showActionSheet, setShowActionSheet] = useState(false);

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

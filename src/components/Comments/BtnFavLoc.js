import { IonAlert, IonBadge, IonButton, IonIcon } from "@ionic/react";
import { bookmarks, bookmarksOutline } from "ionicons/icons";
import { useContext } from "react";
import { Context } from '../../context/Context';

const BtnFavLoc = ({selectedLoc}) => {
  const { 
    user,
    alertUpdateFav, setAlertUpdateFav,
    addFavLoc, removeFavLoc,
  } = useContext(Context);

  return (
    <>
      {user.favorite_locations.find(loc => loc._id === selectedLoc._id) ? (
        <IonButton fill="clear" onClick={() => setAlertUpdateFav({...alertUpdateFav, removeStatus: true, location: selectedLoc})}>
          <IonIcon icon={bookmarks}/>
          <IonBadge slot="end" color="danger">-</IonBadge>
        </IonButton>
        ) : (
        <IonButton fill="clear" onClick={() => setAlertUpdateFav({...alertUpdateFav, addStatus: true, location: selectedLoc})}>
          <IonIcon icon={bookmarksOutline}/>
          <IonBadge slot="end" color="success">+</IonBadge>  
        </IonButton>
      )}
      <IonAlert
        isOpen={alertUpdateFav.addStatus}
        onDidDismiss={() => setAlertUpdateFav({...alertUpdateFav, addStatus: false })}
        header={'Favoriten hinzufügen'}
        message={'Möchtest du den Eisladen deinen Favoriten hinzufügen?'}
        buttons={[
          { text: 'Abbrechen', role: 'cancel' },
          { text: 'Bestätigen', handler: addFavLoc }
        ]}
      />
      <IonAlert
        isOpen={alertUpdateFav.removeStatus}
        onDidDismiss={() => setAlertUpdateFav({...alertUpdateFav, removeStatus: false })}
        header={'Favoriten entfernen'}
        message={'Möchtest du den Eisladen wirklich von deiner Liste entfernen?'}
        buttons={[
          { text: 'Abbrechen', role: 'cancel' },
          { text: 'Bestätigen', handler: removeFavLoc }
        ]}
      />
    </>
  )
}

export default BtnFavLoc

import { useReducer, VFC } from 'react';
import type { IceCreamLocation } from '../../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions } from '../../store/appSlice';
import { userActions } from '../../store/userSlice';
// Context
import { IonAlert, IonButton, IonIcon } from '@ionic/react';
import { heartOutline, heart } from 'ionicons/icons';

interface Props {
  location: IceCreamLocation;
}

interface UpdateFavorites {
  willRemove: boolean;
  willAdd: boolean;
  location: IceCreamLocation | null;
}

const initialState: UpdateFavorites = {
  willRemove: false,
  willAdd: false,
  location: null,
};

enum Actions {
  REMOVE = 'REMOVE',
  RESET_REMOVE = 'RESET_REMOVE',
  FINISHED_REMOVE = 'FINISHED_REMOVE',
  ADD = 'ADD',
  RESET_ADD = 'RESET_ADD',
  FINISHED_ADD = 'FINISHED_ADD',
}

interface UpdateFavoritesStateAction {
  type: Actions;
  payload: Partial<UpdateFavorites>;
}

const updateFavoritesStateReducer = (
  prevState: UpdateFavorites,
  { type, payload }: UpdateFavoritesStateAction
) => {
  switch (type) {
    case Actions.REMOVE:
      return {
        ...prevState,
        willRemove: payload.willRemove,
        location: payload.location,
      } as UpdateFavorites;
    case Actions.RESET_REMOVE:
      return { ...prevState, willRemove: payload.willRemove } as UpdateFavorites;
    case Actions.FINISHED_REMOVE:
      return { ...prevState, willRemove: payload.willRemove, location: null } as UpdateFavorites;
    case Actions.ADD:
      return {
        ...prevState,
        willAdd: payload.willAdd,
        location: payload.location,
      } as UpdateFavorites;
    case Actions.RESET_ADD:
      return { ...prevState, willAdd: payload.willAdd } as UpdateFavorites;
    case Actions.FINISHED_ADD:
      return { ...prevState, willAdd: payload.willAdd, location: null } as UpdateFavorites;
    default:
      return initialState;
  }
};

const ButtonFavoriteLocation: VFC<Props> = ({ location }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [updateFavoritesState, dispatchUpdateFavoritesState] = useReducer(
    updateFavoritesStateReducer,
    initialState
  );

  const addFavLoc = async () => {
    dispatch(appActions.setIsLoading(true));
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const options: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        // converts JS data into JSON string.
        body: JSON.stringify({ add_location_id: updateFavoritesState?.location?._id }),
        credentials: 'include',
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user!._id}/add-fav-loc`,
        options
      );
      // Don't need sended back data of server
      // const favorite_locations = await res.json();
      const newFavLoc = [...user!.favorite_locations, updateFavoritesState.location];
      dispatch(userActions.updateUser({ favorite_locations: newFavLoc as IceCreamLocation[] }));
      dispatchUpdateFavoritesState({
        type: Actions.FINISHED_ADD,
        payload: { willAdd: false },
      });
    } catch (err: any) {
      console.log(err.message);
      dispatch(appActions.setError('Da ist etwas schief gelaufen. Versuche es später nochmal'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    dispatch(appActions.setIsLoading(false));
  };

  const removeFavLoc = async () => {
    dispatch(appActions.setIsLoading(true));
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const options: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        // converts JS data into JSON string.
        body: JSON.stringify({
          remove_location_id: updateFavoritesState?.location?._id,
        }),
        credentials: 'include',
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user!._id}/remove-fav-loc`,
        options
      );
      const favorite_locations = await res.json();
      dispatch(userActions.updateUser({ favorite_locations }));
      dispatchUpdateFavoritesState({
        type: Actions.FINISHED_REMOVE,
        payload: { willRemove: false },
      });
    } catch (err: any) {
      console.log(err.message);
      dispatch(appActions.setError('Da ist etwas schief gelaufen. Versuche es später nochmal'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    dispatch(appActions.setIsLoading(false));
  };

  if (!user) return null;

  const findLocation = user.favorite_locations.find(
    (favoriteLocation: IceCreamLocation) => favoriteLocation._id === location._id
  );

  return (
    <>
      {findLocation && (
        <IonButton
          fill='clear'
          onClick={() =>
            dispatchUpdateFavoritesState({
              type: Actions.REMOVE,
              payload: { willRemove: true, location },
            })
          }
        >
          <IonIcon icon={heart} />
        </IonButton>
      )}
      {!findLocation && (
        <IonButton
          fill='clear'
          onClick={() =>
            dispatchUpdateFavoritesState({
              type: Actions.ADD,
              payload: { willAdd: true, location },
            })
          }
        >
          <IonIcon icon={heartOutline} />
        </IonButton>
      )}
      <IonAlert
        isOpen={updateFavoritesState.willAdd}
        onDidDismiss={() =>
          dispatchUpdateFavoritesState({
            type: Actions.RESET_ADD,
            payload: { willAdd: false },
          })
        }
        header={'Favoriten hinzufügen'}
        message={'Möchtest du den Eisladen deinen Favoriten hinzufügen?'}
        buttons={[
          { text: 'Abbrechen', role: 'cancel' },
          { text: 'Bestätigen', handler: addFavLoc },
        ]}
      />
      <IonAlert
        isOpen={updateFavoritesState.willRemove}
        onDidDismiss={() =>
          dispatchUpdateFavoritesState({
            type: Actions.RESET_REMOVE,
            payload: { willRemove: false },
          })
        }
        header={'Favoriten entfernen'}
        message={'Möchtest du den Eisladen von deiner Liste entfernen?'}
        buttons={[
          { text: 'Abbrechen', role: 'cancel' },
          { text: 'Bestätigen', handler: removeFavLoc },
        ]}
      />
    </>
  );
};

export default ButtonFavoriteLocation;

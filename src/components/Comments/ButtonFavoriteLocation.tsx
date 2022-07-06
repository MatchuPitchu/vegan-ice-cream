import { useMemo, useReducer, VFC } from 'react';
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
  FINISHED_REMOVE = 'FINISHED_REMOVE',
  ADD = 'ADD',
  FINISHED_ADD = 'FINISHED_ADD',
  RESET = 'RESET',
}

interface UpdateFavoritesStateAction {
  type: Actions;
  payload?: Partial<UpdateFavorites>;
}

const updateFavoritesStateReducer = (
  prevState: UpdateFavorites,
  { type, payload }: UpdateFavoritesStateAction
) => {
  switch (type) {
    case Actions.REMOVE:
      return {
        ...prevState,
        willRemove: payload!.willRemove,
        location: payload!.location,
      } as UpdateFavorites;
    case Actions.FINISHED_REMOVE:
      return { ...prevState, willRemove: payload!.willRemove, location: null } as UpdateFavorites;
    case Actions.ADD:
      return {
        ...prevState,
        willAdd: payload!.willAdd,
        location: payload!.location,
      } as UpdateFavorites;
    case Actions.FINISHED_ADD:
      return { ...prevState, willAdd: payload!.willAdd, location: null } as UpdateFavorites;
    case Actions.RESET:
      return initialState;
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

  const findLocation = useMemo(() => {
    return user?.favorite_locations.find(
      (favoriteLocation: IceCreamLocation) => favoriteLocation._id === location._id
    );
  }, [location._id, user]);

  if (!user) return null;

  return (
    <>
      <IonButton
        className='button--hover-transparent'
        fill='clear'
        onClick={() =>
          dispatchUpdateFavoritesState({
            type: findLocation ? Actions.REMOVE : Actions.ADD,
            payload: findLocation ? { willRemove: true, location } : { willAdd: true, location },
          })
        }
      >
        <IonIcon icon={findLocation ? heart : heartOutline} />
      </IonButton>

      <IonAlert
        isOpen={updateFavoritesState.willAdd || updateFavoritesState.willRemove}
        mode='ios'
        onDidDismiss={() =>
          dispatchUpdateFavoritesState({
            type: Actions.RESET,
          })
        }
        header={`Favoriten ${updateFavoritesState.willAdd ? 'hinzufügen' : 'entfernen'}`}
        message={`Möchtest du den Eisladen ${
          updateFavoritesState.willAdd
            ? 'deinen Favoriten hinzufügen?'
            : 'von deiner Liste entfernen?'
        }`}
        buttons={[
          { text: 'Zurück', role: 'cancel' },
          { text: 'Bestätigen', handler: updateFavoritesState.willAdd ? addFavLoc : removeFavLoc },
        ]}
      />
    </>
  );
};

export default ButtonFavoriteLocation;

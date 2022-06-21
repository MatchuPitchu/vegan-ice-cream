import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import Spinner from '../Spinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { appActions } from '../../store/appSlice';

const ActivateUser = () => {
  const dispatch = useAppDispatch();
  const { activateMessage } = useAppSelector((state) => state.app);

  const { id } = useParams();

  useEffect(() => {
    const activateUser = async () => {
      try {
        const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        };
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/auth/activate/user/${id}`,
          options
        );
        const { message } = await res.json();
        dispatch(appActions.setActivateAccountMessage(message));
      } catch (error) {
        console.log(error);
      }
    };

    if (activateMessage === 'Waiting') activateUser();
  }, [id, activateMessage, dispatch]);

  return (
    <IonPage>
      {activateMessage === 'Waiting' ? (
        <IonContent>
          <div className='text-center'>Einen Moment bitte ...</div>
        </IonContent>
      ) : (
        <Spinner />
      )}
    </IonPage>
  );
};

export default ActivateUser;

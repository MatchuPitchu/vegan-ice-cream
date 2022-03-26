import { useContext, useEffect } from 'react';
import { Context } from '../../context/Context';
import { useParams } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import Spinner from '../Spinner';

const ActivateUser = () => {
  const { activateMessage, setActivateMessage } = useContext(Context);
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
        setActivateMessage(message);
      } catch (error) {
        console.log(error);
      }
    };

    if (activateMessage === 'Waiting') activateUser();
  }, [activateMessage, id, setActivateMessage]);

  return activateMessage === 'Waiting' ? (
    <IonPage>
      <IonContent>
        <div className='text-center'>Einen Moment bitte ...</div>
      </IonContent>
    </IonPage>
  ) : (
    <IonPage>
      <Spinner />
    </IonPage>
  );
};

export default ActivateUser;

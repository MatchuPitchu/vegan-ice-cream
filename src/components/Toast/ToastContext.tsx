import { FC } from 'react';
import { IonLoading, IonToast } from '@ionic/react';
import { useAppSelector } from '../../store/hooks';

export const Notification: FC = ({ children }) => {
  const { isLoading, error } = useAppSelector((state) => state.app);

  return (
    <>
      <IonLoading isOpen={isLoading} message={'Einen Moment bitte ...'} />
      <IonToast cssClass='toast--error' isOpen={!!error} message={error} />
      {children}
    </>
  );
};

import { createContext, FC, useContext } from 'react';
import { IonLoading, IonToast } from '@ionic/react';
import { useAppSelector } from '../store/hooks';

const NotificationContext = createContext<undefined>(undefined);

export const NotificationProvider: FC = ({ children }) => {
  const { isLoading, error } = useAppSelector((state) => state.app);

  const values = undefined;

  return (
    <NotificationContext.Provider value={values}>
      <IonLoading isOpen={isLoading} message={'Einen Moment bitte ...'} />
      <IonToast cssClass='toast--error' isOpen={!!error} message={error} />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

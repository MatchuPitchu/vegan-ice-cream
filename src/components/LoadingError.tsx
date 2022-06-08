import { VFC } from 'react';
import { useAppSelector } from '../store/hooks';
import { IonLoading, IonToast } from '@ionic/react';

const LoadingError: VFC = () => {
  const { isLoading, error } = useAppSelector((state) => state.app);

  return (
    <>
      <IonLoading isOpen={isLoading} message={'Einen Moment bitte ...'} />
      <IonToast
        cssClass='errorToast'
        isOpen={!!error} // convert error string to boolean
        message={error}
      />
    </>
  );
};

export default LoadingError;

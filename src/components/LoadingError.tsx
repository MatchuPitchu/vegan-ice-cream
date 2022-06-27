import { VFC } from 'react';
import { useAppSelector } from '../store/hooks';
import { IonLoading, IonToast } from '@ionic/react';

// TODO: LoadingError create as Overlay with React Portal
const LoadingError: VFC = () => {
  const { isLoading, error } = useAppSelector((state) => state.app);

  return (
    <>
      <IonLoading isOpen={isLoading} message={'Einen Moment bitte ...'} />
      <IonToast
        cssClass='toast--error'
        isOpen={!!error} // convert error string to boolean
        message={error}
      />
    </>
  );
};

export default LoadingError;

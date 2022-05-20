import { useContext } from 'react';
import { Context } from '../context/Context';
import { IonLoading, IonToast } from '@ionic/react';

const LoadingError = () => {
  const { isLoading, error } = useContext(Context);

  return (
    <>
      <IonLoading
        // isLoading is only true or false
        isOpen={isLoading}
        message={'Einen Moment bitte ...'}
      />
      <IonToast
        cssClass='errorToast'
        // error is message, so need to spezify that if msg than true
        isOpen={error ? true : false}
        message={error}
      />
    </>
  );
};

export default LoadingError;

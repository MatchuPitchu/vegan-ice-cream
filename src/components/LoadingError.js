import { useContext } from 'react';
import { Context } from "../context/Context";
import { IonLoading, IonToast } from "@ionic/react"

const LoadingError = () => {
  const {
    loading, setLoading,
    error, setError,
  } = useContext(Context);

  return (
    <>
      <IonToast
        cssClass="errorToast"
        isOpen={error ? true : false} 
        message={error} 
        onDidDismiss={() => setError('')}
      />
      <IonLoading 
        isOpen={loading ? true : false} 
        message={"Einen Moment bitte ..."}
        onDidDismiss={() => setLoading(false)}
      />
    </>
  )
}

export default LoadingError

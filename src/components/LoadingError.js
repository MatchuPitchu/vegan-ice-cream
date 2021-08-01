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
      <IonLoading 
        // loading is only true or false
        isOpen={loading} 
        message={"Einen Moment bitte ..."}
        onDidDismiss={() => setLoading(false)}
      />
      <IonToast
        cssClass="errorToast"
        // error is message, so need to spezify that if msg than true
        isOpen={error ? true : false} 
        message={error} 
        onDidDismiss={() => setError('')}
      />
    </>
  )
}

export default LoadingError

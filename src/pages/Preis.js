import { useContext, useState } from 'react';
// Redux Store
import { useAppSelector } from '../store/hooks';
// Context
import { Context } from '../context/Context';
import { useThemeContext } from '../context/ThemeContext';
import { Controller, useForm } from 'react-hook-form';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRange,
} from '@ionic/react';
import { add, cashOutline } from 'ionicons/icons';
import LoadingError from '../components/LoadingError';
import Spinner from '../components/Spinner';

const Preis = () => {
  const { isAuth } = useAppSelector((state) => state.user);

  const { setLoading, user, searchSelected, setSearchSelected, createPricing } =
    useContext(Context);
  const { isDarkTheme } = useThemeContext();

  const [endReset, setEndReset] = useState(false);

  const defaultValues = {
    pricing: 0,
  };

  // Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    setLoading(true);
    if (data.pricing && data.pricing > 0) createPricing(data);

    setSearchSelected(null);
    setEndReset(true);
    setTimeout(() => setEndReset(false), 5000);
    setLoading(false);
  };

  return isAuth && user ? (
    <IonPage>
      <IonHeader>
        <img
          className='headerMap'
          src={`${
            isDarkTheme ? './assets/header-bewerten-dark.svg' : './assets/header-bewerten-light.svg'
          }`}
          alt=''
        />
      </IonHeader>

      <IonContent>
        {!endReset ? (
          <div className='container mt-3 text-center'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <IonItem lines='none' className='mb-1'>
                <IonLabel position='stacked' htmlFor='location'>
                  Name des Eisladens
                </IonLabel>
                <IonInput
                  readonly
                  type='text'
                  value={
                    searchSelected ? `${searchSelected.name} in ${searchSelected.address.city}` : ''
                  }
                />
              </IonItem>

              <IonItem lines='none' className='mb-1'>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <IonLabel position='stacked' className='pb-1'>
                        Preis Eiskugel
                      </IonLabel>
                      <div className='priceInfo'>{parseFloat(value).toFixed(2)} €</div>
                      <IonRange
                        className='px-0'
                        min={0}
                        max={3}
                        step={0.1}
                        snaps
                        value={value}
                        onIonChange={(e) => onChange(e.detail.value)}
                      >
                        <IonIcon slot='start' size='small' icon={cashOutline} />
                        <IonIcon slot='end' icon={cashOutline} />
                      </IonRange>
                    </>
                  )}
                  name='pricing'
                />
              </IonItem>

              <IonButton fill='solid' className='check-btn my-3' type='submit'>
                <IonIcon className='pe-1' icon={add} />
                Kugelpreis eintragen
              </IonButton>
            </form>
          </div>
        ) : (
          <div className='container text-center'>
            <IonCard>
              <IonCardContent>
                <IonCardTitle>Danke für deine Eingabe</IonCardTitle>
              </IonCardContent>
            </IonCard>
          </div>
        )}

        <LoadingError />
      </IonContent>
    </IonPage>
  ) : (
    <IonPage>
      <Spinner />
    </IonPage>
  );
};

export default Preis;

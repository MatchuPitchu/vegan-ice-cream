import { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { appActions } from '../store/appSlice';
import { usePostPricingMutation } from '../store/api/locations-api-slice';
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
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.user);

  const { searchSelected, setSearchSelected } = useContext(Context);
  const { isDarkTheme } = useThemeContext();

  const [finishPriceUpdate, setFinishPriceUpdate] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);

  const [triggerPriceUpdate, result] = usePostPricingMutation();

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
    dispatch(appActions.setIsLoading(true));
    if (data.pricing && data.pricing > 0) {
      await triggerPriceUpdate({ location_id: searchSelected._id, pricing: data.pricing });
    }

    setIsFormVisible(false);
    setSearchSelected(null);
    setTimeout(() => setFinishPriceUpdate(true), 2000);
    setTimeout(() => setIsFormVisible(true), 3000);
    setTimeout(() => setFinishPriceUpdate(false), 3000);
    dispatch(appActions.setIsLoading(false));
  };

  if (finishPriceUpdate) return <Redirect to='/home' exact />;

  if (!isAuth && !user)
    return (
      <IonPage>
        <Spinner />
      </IonPage>
    );

  return (
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
        {isFormVisible && (
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
        )}

        {!isFormVisible && (
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
  );
};

export default Preis;

import { useState, VFC } from 'react';
import { Redirect } from 'react-router-dom';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { appActions } from '../store/appSlice';
import { useUpdatePricingMutation } from '../store/api/locations-api-slice';
import { getSelectedLocation, locationsActions } from '../store/locationsSlice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
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

interface PricingSubmitData {
  pricing: number;
}

const Preis: VFC = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.user);
  const selectedLocation = useAppSelector((state) => getSelectedLocation(state.locations));

  const { isDarkTheme } = useThemeContext();

  const [finishPriceUpdate, setFinishPriceUpdate] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);

  const [triggerUpdatePricing, result] = useUpdatePricingMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    field: { onChange, name, value },
    fieldState: { invalid, isTouched, isDirty },
  } = useController({
    name: 'pricing',
    control,
    defaultValue: 0,
  });

  const onSubmit: SubmitHandler<PricingSubmitData> = async ({ pricing }) => {
    if (!pricing) return;

    dispatch(appActions.setIsLoading(true));
    if (pricing > 0) {
      await triggerUpdatePricing({ location_id: selectedLocation!._id, pricing });
    }
    setIsFormVisible(false);
    setTimeout(() => setFinishPriceUpdate(true), 2000);
    setTimeout(() => setIsFormVisible(true), 3000);
    setTimeout(() => setFinishPriceUpdate(false), 3000);
    dispatch(locationsActions.resetSelectedLocation());
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
                <IonLabel position='stacked'>Name des Eisladens</IonLabel>
                <IonInput
                  className='pricing-form__display-location'
                  readonly
                  type='text'
                  value={
                    selectedLocation
                      ? `${selectedLocation.name} in ${selectedLocation.address.city}`
                      : ''
                  }
                />
              </IonItem>

              <IonItem lines='none' className='mb-1'>
                <IonLabel position='stacked' className='pb-1'>
                  Preis Eiskugel
                </IonLabel>
                <div className='pricing__info'>
                  {parseFloat(value) !== 0 &&
                    `${parseFloat(value).toFixed(2).replace(/\./, ',')} €`}
                </div>
                <IonRange
                  className='px-0'
                  name={name}
                  value={value}
                  onIonChange={({ detail }) => onChange(detail.value)}
                  min={0.0}
                  max={4.0}
                  step={0.1}
                  snaps={true}
                  ticks={false}
                >
                  <IonIcon slot='start' size='small' icon={cashOutline} />
                  <IonIcon slot='end' icon={cashOutline} />
                </IonRange>
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

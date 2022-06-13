import { useState, useEffect, useRef } from 'react';
import { Controller, useForm, SubmitHandler, useFieldArray, get } from 'react-hook-form';
import type { PopoverState } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { flavorActions } from '../store/flavorSlice';
import { appActions } from '../store/appSlice';
import { getSelectedLocation, locationsActions } from '../store/locationsSlice';
import { searchActions } from '../store/searchSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetOneLocationQuery, useUpdatePricingMutation } from '../store/api/locations-api-slice';
import { useAddCommentMutation } from '../store/api/comment-api-slice';
import { useAddFlavorMutation } from '../store/api/flavor-api-slice';
import { useGetAdditionalInfosFromUserQuery } from '../store/api/user-api-slice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonPopover,
  IonText,
  IonTextarea,
} from '@ionic/react';
import {
  add,
  addCircleSharp,
  informationCircle,
  removeCircleOutline,
  starHalfOutline,
} from 'ionicons/icons';
import {
  factorToConvertRatingScale,
  handleChangeFlavorTypeToggleGroup,
} from '../utils/variables-and-functions';
import Error from '../components/Error';
import Search from '../components/Search';
import SearchFlavors from '../components/SearchFlavors';
import LoadingError from '../components/LoadingError';
import Spinner from '../components/Spinner';
import RatingInput from '../components/FormFields/RatingInput';
import Checkbox from '../components/FormFields/Checkbox';
import PricingRange from '../components/FormFields/PricingRange';
import ColorPicker from '../components/FormFields/ColorPicker';
import DatePicker from '../components/FormFields/DatePicker';
import TextareaInput from '../components/FormFields/TextareaInput';

interface BewertenFormValues {
  location: string;
  pricing: number;
  name: string;
  type_cream: boolean;
  type_fruit: boolean;
  colors: { value: string }[];
  text: string;
  rating_quality: number;
  bio: boolean;
  vegan: boolean;
  lactose_free: boolean;
  not_specified: boolean;
  rating_vegan_offer: number;
  date: string;
}

const Bewerten = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.user);
  const { flavor, searchTextFlavor: searchTermFlavor } = useAppSelector((state) => state.flavor);
  const selectedLocation = useAppSelector(getSelectedLocation);

  const { isDarkTheme } = useThemeContext();

  const [popoverInfo, setPopoverInfo] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });
  const [success, setSuccess] = useState(false);

  const [refetchLocationId, setRefetchLocationId] = useState<string | null>(null);
  const [refetchUserId, setRefetchUserId] = useState<string | null>(null);

  const [triggerUpdatePricing, result1] = useUpdatePricingMutation();
  const [triggerAddComment, result2] = useAddCommentMutation();
  const [triggerAddFlavor, result3] = useAddFlavorMutation();

  const {
    data: updatedLocation,
    error: errorFetchUpdatedLocation,
    isLoading: isLoadingFetchUpdatedLocation,
    isSuccess: isSuccessFetchUpdatedLocation,
  } = useGetOneLocationQuery(refetchLocationId ?? skipToken);

  const {
    error: error2,
    isLoading: isLoading2,
    isSuccess: isSuccessFetchAddtionalUserInfo,
  } = useGetAdditionalInfosFromUserQuery(refetchUserId ?? skipToken);

  useEffect(() => {
    if (isSuccessFetchUpdatedLocation && updatedLocation) {
      dispatch(locationsActions.updateSingleLocation(updatedLocation));
      setRefetchLocationId(null);
    }
  }, [isSuccessFetchUpdatedLocation, updatedLocation, dispatch]);

  useEffect(() => {
    if (isSuccessFetchAddtionalUserInfo) {
      setRefetchUserId(null);
    }
  }, [isSuccessFetchAddtionalUserInfo]);

  const flavorRef = useRef<HTMLIonLabelElement>(null);

  const defaultBewertenValues: BewertenFormValues = {
    location: '',
    pricing: 0,
    name: '',
    type_cream: false,
    type_fruit: false,
    colors: [
      {
        value: '',
      },
    ],
    text: '',
    rating_quality: 0,
    bio: false,
    vegan: false,
    lactose_free: false,
    not_specified: false,
    rating_vegan_offer: 0,
    date: '',
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BewertenFormValues>({
    defaultValues: defaultBewertenValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'colors',
  });

  useEffect(() => {
    if (flavor) {
      setValue('name', flavor ? searchTermFlavor : '');
      setValue('type_fruit', flavor?.type_fruit ?? false);
      setValue('type_cream', flavor?.type_cream ?? false);
      setValue('colors.0.value', flavor?.color.primary ?? '');
      setValue('colors.1.value', flavor?.color.secondary ?? '');
    }
  }, [flavor, searchTermFlavor, setValue]);

  const onSubmit: SubmitHandler<BewertenFormValues> = async (data) => {
    if (!user) return;
    dispatch(appActions.setIsLoading(true));

    // Create Pricing and add to database
    if (data?.pricing > 0) {
      await triggerUpdatePricing({ location_id: selectedLocation._id, pricing: data.pricing });
    }

    try {
      const createdComment = await triggerAddComment({
        location_id: selectedLocation._id,
        user_id: user._id,
        newCommentData: data,
      }).unwrap();

      const flavorData = {
        name: data.name,
        type_fruit: data.type_fruit,
        type_cream: data.type_cream,
        color: {
          primary: data.colors[0].value,
          secondary: data.colors[1].value,
        },
      };

      const result = await triggerAddFlavor({
        comment_id: createdComment._id,
        location_id: selectedLocation._id,
        user_id: user._id,
        flavorData,
      }).unwrap();

      console.log(result);

      // replace data of updated loc in locations array
      setRefetchLocationId(selectedLocation._id);

      // TODO: IF NEW COMMENT POST REQUEST + FLAVOR POST REQUEST FULLFILLED, THAN TRIGGER REFETCH USER DATA
      // OLD: look at context useEffect -> if newComment is set than user data is refetched in Context
      // dispatch(commentActions.setNewComment(createdComment));
      setRefetchUserId(user._id);

      // clean values that are needed for form searchbars
      dispatch(searchActions.setSearchText(''));
      dispatch(flavorActions.setSearchTermFlavor(''));
      dispatch(flavorActions.resetFlavor());
      dispatch(locationsActions.resetSelectedLocation());

      // delay is needed, otherwise memory leak if state updates on unmounted component
      setTimeout(() => setSuccess(true), 500);
    } catch (err: any) {
      dispatch(appActions.setError(err.message));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }

    dispatch(appActions.setIsLoading(false));
  };

  const handleChangeToggleGroup = ({ name, value }: { name: string; value: boolean }) => {
    handleChangeFlavorTypeToggleGroup(setValue, { name, value });
  };

  const handleScrollIntoView = () => flavorRef?.current?.scrollIntoView({ behavior: 'smooth' });

  const successSection = success && (
    <div className='container text-center'>
      <IonCard>
        <IonCardContent>
          <IonCardTitle>Danke für deine Bewertung</IonCardTitle>
          <IonButton
            fill='solid'
            className='check-btn my-3'
            onClick={() => {
              setSuccess(false);
              reset(); // Reset React Hook Form
            }}
          >
            <IonIcon className='pe-1' icon={add} />
            Weitere Bewertung
          </IonButton>
        </IonCardContent>
      </IonCard>
    </div>
  );

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
        {!success && (
          <div className='container mt-3'>
            <IonItem lines='none' className='mb-1 item-text--small'>
              <IonIcon
                className='infoIcon me-1'
                color='primary'
                onClick={(event) => {
                  event.persist();
                  setPopoverInfo({ showPopover: true, event });
                }}
                icon={informationCircle}
              />
              <IonLabel className='ion-text-wrap'>Bewerte nur 1 Eissorte</IonLabel>

              <IonPopover
                cssClass='info-popover'
                event={popoverInfo.event}
                isOpen={popoverInfo.showPopover}
                onDidDismiss={() => setPopoverInfo({ showPopover: false, event: undefined })}
              >
                Damit eine Bewertung fix zu tippen ist, bezieht sie sich nur auf 1 Eissorte. Hast du
                mehr probiert, kannst du auch eine weitere Bewertung abgeben.
              </IonPopover>
            </IonItem>

            <div className='pt-2' style={{ backgroundColor: 'var(--ion-item-background)' }}>
              <Search />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <IonItem lines='none' className='mb-1 item-text--small'>
                <IonLabel slot='start'>Gewählter Eisladen</IonLabel>
                <IonText slot='start' color={`${selectedLocation?.name ? 'dark' : 'medium'}`}>
                  {selectedLocation?.name ?? '... suche einen Eisladen'}
                </IonText>
              </IonItem>
              {Error('location', errors)}

              <PricingRange name='pricing' control={control} />

              <SearchFlavors />

              {/* TODO: ersetzen mit einfach setValue('name', searchTermFlavor) und checken, wie Validierung funktioniert mit error message */}
              {/* Hide Input Item because it only doubles searchbar value */}
              <IonItem hidden lines='none'>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonInput
                      readonly
                      autocapitalize='words'
                      type='text'
                      value={(value = searchTermFlavor)}
                      onIonChange={(e) => {
                        onChange(e.detail.value);
                      }}
                    />
                  )}
                  name='name'
                  rules={{ required: true }}
                />
              </IonItem>
              {Error('name', errors)}

              <IonItem lines='none'>
                <IonLabel position='stacked'>Sorbet • Fruchteis</IonLabel>
                <Checkbox name='type_fruit' control={control} disabled={!!flavor?.name} />
              </IonItem>
              <IonItem lines='none'>
                <IonLabel position='stacked'>Cremeeis • Milcheis • Pflanzenmilcheis</IonLabel>
                <Checkbox name='type_cream' control={control} disabled={!!flavor?.name} />
              </IonItem>
              <IonItem lines='none'>
                <IonLabel ref={flavorRef} className='mb-1' position='stacked'>
                  Farbe(n) Eis (1 oder 2)
                </IonLabel>
                <IonButton
                  type='button'
                  color='primary'
                  fill='clear'
                  slot='end'
                  onClick={() => (fields.length === 1 ? append({ value: '' }) : remove(1))}
                >
                  <IonIcon icon={fields.length === 1 ? addCircleSharp : removeCircleOutline} />
                </IonButton>
              </IonItem>
              <div className='mb-1'>
                {fields.map((field, index) => (
                  <ColorPicker
                    key={field.id}
                    name={`colors.${index}.value` as const}
                    control={control}
                    rules={{
                      required: 'Wähle mindestens 1 Farbe aus',
                      validate: (input) =>
                        input !== 'transparent' || 'Wähle mindestens 1 Farbe aus',
                    }}
                    onSelectColor={handleScrollIntoView}
                  />
                ))}
                {(errors.colors?.[0] || errors.colors?.[1]) && (
                  <div className='pb-2'>{errors.colors?.[0].value?.message}</div>
                )}
              </div>

              <IonItem lines='none' className='mb-1'>
                <IonLabel position='stacked'>Kommentar</IonLabel>
                <div className='ion-text-wrap textSmallLight'>
                  ... Geschmack, Konsistenz, Waffel, Preis-Leistung, Zusatzleistungen wie vegane
                  Sahne, Waffeln oder Soßen, Freundlichkeit ...
                </div>
                <TextareaInput
                  name='text'
                  control={control}
                  rules={{ required: 'Was möchtest du über den Eisladen teilen?' }}
                />
              </IonItem>

              <IonItem lines='none' className='rating--bewerten-page'>
                <IonLabel position='stacked'>Eis-Erlebnis</IonLabel>
                <div className='ion-text-wrap textSmallLight'>
                  ... gewählte Eiskugel, Waffel, dein Eindruck vom Eisladen ...
                </div>
                <RatingInput
                  name='rating_quality'
                  control={control}
                  rules={{ required: 'Die Sterne fehlen', min: 0.5 * factorToConvertRatingScale }}
                  className='react-stars--bewerten-page'
                />
              </IonItem>

              {/* NEU CHECKEN MIT ERROR HANDLUNG UND BACKEND -> SOLL ALS ERGÄNZUNG ZU COMMENT GESPEICHERT WERDEN, NICHT IN FLAVOR */}
              <IonItem lines='none' className='mb-1'>
                <IonLabel position='stacked'>Mein Eis war ...</IonLabel>
                <div className='row'>
                  <div className='col'>
                    <IonLabel position='stacked'>bio</IonLabel>
                    <Checkbox
                      name='bio'
                      control={control}
                      onToggleClick={handleChangeToggleGroup}
                    />
                  </div>
                  <div className='col'>
                    <IonLabel position='stacked'>vegan</IonLabel>
                    <Checkbox
                      name='vegan'
                      control={control}
                      onToggleClick={handleChangeToggleGroup}
                    />
                  </div>
                  <div className='col'>
                    <IonLabel position='stacked'>laktosefrei</IonLabel>
                    <Checkbox
                      name='lactose_free'
                      control={control}
                      onToggleClick={handleChangeToggleGroup}
                    />
                  </div>
                  <div className='col'>
                    <IonLabel position='stacked'>weiß nicht</IonLabel>
                    <Checkbox
                      name='not_specified'
                      control={control}
                      onToggleClick={handleChangeToggleGroup}
                    />
                  </div>
                </div>
              </IonItem>

              <IonItem lines='none' className='rating--bewerten-page'>
                <IonLabel position='stacked'>Veganes Angebot Eisladen</IonLabel>
                <div className='ion-text-wrap textSmallLight'>
                  ... viele vegane Sorten, vegane Waffeln, vegane Sahne, vegane Sauce ...
                </div>
                <RatingInput
                  name='rating_vegan_offer'
                  control={control}
                  rules={{ required: 'Die Sterne fehlen', min: 0.5 * factorToConvertRatingScale }}
                  className='react-stars--bewerten-page'
                />
              </IonItem>

              <IonItem lines='none' className='my-1'>
                <IonLabel position='stacked'>Datum</IonLabel>
                <DatePicker name='date' control={control} />
              </IonItem>

              <IonButton fill='solid' className='check-btn my-3' type='submit'>
                <IonIcon className='pe-1' slot='end' icon={starHalfOutline} />
                Bewertung abgeben
              </IonButton>
            </form>
          </div>
        )}

        {successSection}

        <LoadingError />
      </IonContent>
    </IonPage>
  );
};

export default Bewerten;

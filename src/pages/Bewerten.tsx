import { useState, useEffect, useRef } from 'react';
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
// Context
import { useThemeContext } from '../context/ThemeContext';
import { CirclePicker } from 'react-color';
import { Controller, useForm, useController, SubmitHandler } from 'react-hook-form';
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
  IonRange,
  IonTextarea,
  IonToggle,
} from '@ionic/react';
import { add, cashOutline, colorPaletteOutline, informationCircle } from 'ionicons/icons';
import Error from '../components/Error';
import Search from '../components/Search';
import SearchFlavors from '../components/SearchFlavors';
import LoadingError from '../components/LoadingError';
import Spinner from '../components/Spinner';
import { useGetAdditionalInfosFromUserQuery } from '../store/api/user-api-slice';
import RatingInput from '../components/FormFields/RatingInput';
import { PopoverState } from '../types/types';
import Checkbox from '../components/FormFields/Checkbox';
import { colorPickerColors, factorToConvertRatingScale } from '../utils/variables-and-functions';

interface BewertenFormValues {
  location: string;
  pricing: number;
  name: string;
  type_cream: boolean;
  type_fruit: boolean;
  color1: string;
  color2: string;
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

  const [triggerUpdatePricing, result1] = useUpdatePricingMutation();
  const [triggerAddComment, result2] = useAddCommentMutation();
  const [triggerAddFlavor, result3] = useAddFlavorMutation();

  const [refetchLocationId, setRefetchLocationId] = useState<string | null>(null);
  const [refetchUserId, setRefetchUserId] = useState<string | null>(null);

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

  const [popoverInfo, setPopoverInfo] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });
  const [showColorPicker, setShowColorPicker] = useState({ field1: false, field2: false });
  const [success, setSuccess] = useState(false);
  const flav1Ref = useRef<HTMLIonLabelElement>(null);
  const flav2Ref = useRef<HTMLIonLabelElement>(null);

  const defaultValues: BewertenFormValues = {
    location: '',
    pricing: 0,
    name: '',
    type_cream: false,
    type_fruit: false,
    color1: '',
    color2: '',
    text: '',
    rating_quality: 0,
    bio: false,
    vegan: false,
    lactose_free: false,
    not_specified: false,
    rating_vegan_offer: 0,
    date: '',
  };

  // Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<BewertenFormValues>({
    defaultValues,
  });

  const {
    field: { onChange, name: pricingFieldName, value },
  } = useController({
    name: 'pricing',
    control,
    defaultValue: 0,
  });

  useEffect(() => {
    setValue('name', flavor ? searchTermFlavor : '');
    setValue('type_fruit', flavor?.type_fruit ?? false);
    setValue('type_cream', flavor?.type_cream ?? false);
    setValue('color1', flavor?.color.primary ?? '');
    setValue('color2', flavor?.color.secondary ?? '');
    // if user selects location for example on map, than this location name is set as value is form
    setValue('location', selectedLocation?.name || '');
  }, [flavor, searchTermFlavor, selectedLocation, setValue]);

  const handleChangeToggleGroup = ({ name, value }: { name: string; value: boolean }) => {
    switch (name) {
      case 'bio':
        if (value) {
          setValue('not_specified', false);
        }
        break;
      case 'vegan':
        if (value) {
          setValue('not_specified', false);
        }
        setValue('lactose_free', value);
        break;
      case 'lactose_free':
        if (value) {
          setValue('not_specified', false);
        }
        break;
      case 'not_specified':
        if (value) {
          setValue('bio', false);
          setValue('vegan', false);
          setValue('lactose_free', false);
        }
        break;
    }
  };

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
          primary: data.color1,
          secondary: data.color2,
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
        {!success && (
          <div className='container mt-3'>
            <IonItem lines='none' className='mb-1 itemTextSmall'>
              <IonIcon
                className='infoIcon me-1'
                color='primary'
                onClick={(event) => {
                  event.persist();
                  setPopoverInfo({ showPopover: true, event: event });
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
              <IonItem lines='none' className='mb-1'>
                <IonLabel position='stacked'>Name Eisladen</IonLabel>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonInput
                      className='inputField'
                      readonly
                      type='text'
                      placeholder='Nutze die Suche'
                      value={(value = selectedLocation?.name || '')}
                      onIonChange={(e) => onChange(e.detail.value)}
                    />
                  )}
                  name='location'
                  rules={{ required: true }}
                />
              </IonItem>
              {Error('location', errors)}

              <IonItem className='mb-1' lines='none'>
                <IonLabel position='stacked' className='pb-1'>
                  Preis Eiskugel
                </IonLabel>
                <div className='pricing__info'>
                  {value !== 0 &&
                    value.toLocaleString('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                      currencyDisplay: 'symbol',
                    })}
                </div>
                <IonRange
                  name={pricingFieldName}
                  className='px-0'
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

              <SearchFlavors />

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
                <div className='row'>
                  <div className='col mt-2'>
                    <IonLabel position='stacked'>Sorbet • Fruchteis</IonLabel>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <IonToggle
                          disabled={flavor?.name ? true : false}
                          onIonChange={(e) => onChange(e.detail.checked)}
                          checked={value}
                        />
                      )}
                      name='type_fruit'
                    />
                  </div>
                  <div className='col mt-2'>
                    <IonLabel position='stacked'>Cremeeis • Milcheis • Pflanzenmilcheis</IonLabel>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <IonToggle
                          disabled={flavor?.name ? true : false}
                          onIonChange={(e) => onChange(e.detail.checked)}
                          checked={value}
                        />
                      )}
                      name='type_cream'
                    />
                  </div>
                </div>
              </IonItem>

              <IonItem lines='none'>
                <IonLabel ref={flav1Ref} className='mb-1' position='stacked'>
                  Farbmischung deiner Eiskugel
                </IonLabel>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <IonButton
                        color='primary'
                        fill='clear'
                        onClick={() =>
                          setShowColorPicker((prev) => ({ ...prev, field1: !prev.field1 }))
                        }
                      >
                        <IonIcon icon={colorPaletteOutline} />
                        <div
                          className='ms-1'
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '100%',
                            backgroundColor: value,
                          }}
                        ></div>
                      </IonButton>
                      {showColorPicker.field1 && (
                        <div className='colorPicker ion-padding'>
                          <CirclePicker
                            colors={colorPickerColors}
                            circleSpacing={15}
                            circleSize={25}
                            onChangeComplete={(e) => {
                              onChange(e.hex);
                              flav1Ref?.current?.scrollIntoView();
                              setShowColorPicker((prev) => ({ ...prev, field1: !prev.field1 }));
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                  name='color1'
                  rules={{ required: true }}
                />
              </IonItem>
              {/* getValues is needed, otherwise error is displayed even if user select flavor in search after first submit try of form */}
              {!getValues('color1') && Error('color1', errors)}

              <IonItem lines='none' className='mb-1'>
                <IonLabel ref={flav2Ref} className='mb-1' position='stacked'></IonLabel>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <IonButton
                        className='mb-3'
                        color='primary'
                        fill='clear'
                        onClick={() =>
                          setShowColorPicker((prev) => ({ field1: false, field2: !prev.field2 }))
                        }
                      >
                        <IonIcon icon={colorPaletteOutline} />
                        <div
                          className='ms-1'
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '100%',
                            backgroundColor: value,
                          }}
                        ></div>
                      </IonButton>
                      {showColorPicker.field2 && (
                        <div className='colorPicker ion-padding'>
                          <CirclePicker
                            colors={colorPickerColors}
                            circleSpacing={15}
                            circleSize={25}
                            onChangeComplete={(e) => {
                              onChange(e.hex);
                              flav2Ref?.current?.scrollIntoView();
                              setShowColorPicker((prev) => ({
                                field1: false,
                                field2: !prev.field2,
                              }));
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                  name='color2'
                />
              </IonItem>

              <IonItem lines='none' className='mb-1'>
                <IonLabel position='stacked'>Kommentar</IonLabel>
                <div className='ion-text-wrap textSmallLight'>
                  ... Geschmack, Konsistenz, Waffel, Preis-Leistung, Zusatzleistungen wie vegane
                  Sahne, Waffeln oder Soßen, Freundlichkeit ...
                </div>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonTextarea
                      className='textField'
                      autoGrow={true}
                      value={value}
                      onIonChange={(e) => onChange(e.detail.value)}
                    />
                  )}
                  name='text'
                  rules={{ required: true }}
                />
              </IonItem>
              {selectedLocation && Error('text', errors)}

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
                <IonLabel position='stacked'>Mein Eis-Erlebnis war ...</IonLabel>
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
                  ... viele vegane Sorten, vegane Waffeln, vegane Sahne ...
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
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonDatetime
                      min='2021'
                      max='2023'
                      monthNames='Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember'
                      displayFormat='D. MMMM YYYY'
                      value={value}
                      onIonChange={(e) => onChange(e.detail.value)}
                      cancelText='Zurück'
                      doneText='OK'
                    />
                  )}
                  name='date'
                />
              </IonItem>
              {Error('date', errors)}

              <IonButton fill='solid' className='check-btn my-3' type='submit'>
                <IonIcon className='pe-1' icon={add} />
                Bewertung abgeben
              </IonButton>
            </form>
          </div>
        )}
        {success && (
          <div className='container text-center'>
            <IonCard>
              <IonCardContent>
                <IonCardTitle>Danke für deine Bewertung</IonCardTitle>
                <IonButton
                  fill='solid'
                  className='check-btn my-3'
                  onClick={() => {
                    setSuccess(false);
                    // Reset React Hook Form
                    reset();
                  }}
                >
                  <IonIcon className='pe-1' icon={add} />
                  Weitere Bewertung
                </IonButton>
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

export default Bewerten;

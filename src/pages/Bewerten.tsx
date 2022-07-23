import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import type { Flavor } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { flavorActions } from '../store/flavorSlice';
import { appActions } from '../store/appSlice';
import { userActions } from '../store/userSlice';
import { getSelectedLocation, locationsActions } from '../store/locationsSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetOneLocationQuery, useUpdatePricingMutation } from '../store/api/locations-api-slice';
import { useAddCommentMutation } from '../store/api/comment-api-slice';
import { useAddFlavorMutation } from '../store/api/flavor-api-slice';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { addCircleSharp, removeCircleSharp, starHalfOutline } from 'ionicons/icons';
import {
  factorToConvertRatingScale,
  handleChangeFlavorTypeToggleGroup,
} from '../utils/variables-and-functions';
import Spinner from '../components/Spinner';
import RatingInput from '../components/FormFields/RatingInput';
import Checkbox from '../components/FormFields/Checkbox';
import PricingRange from '../components/FormFields/PricingRange';
import ColorPicker from '../components/FormFields/ColorPicker';
import DatePicker from '../components/FormFields/DatePicker';
import TextareaInput from '../components/FormFields/TextareaInput';
import PageWrapper from '../components/PageUtils/PageWrapper';
import { CustomSearchLocation } from '../components/FormFields/CustomSearchLocation';
import { CustomSearchFlavor } from '../components/FormFields/CustomSearchFlavor';
import Popover from '../components/Popover';

interface BewertenFormValues {
  location: string;
  pricing: number;
  flavorName: string;
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

const defaultBewertenValues: BewertenFormValues = {
  location: '',
  pricing: 0,
  flavorName: '',
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

const Bewerten = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.user);
  const { flavor } = useAppSelector((state) => state.flavor);
  const selectedLocation = useAppSelector(getSelectedLocation);

  const [triggerUpdatePricing] = useUpdatePricingMutation();
  const [triggerAddComment] = useAddCommentMutation();
  const [triggerAddFlavor] = useAddFlavorMutation();

  const [success, setSuccess] = useState(false);
  const [fetchLocationId, setFetchLocationId] = useState<string | typeof skipToken>(skipToken);

  const { data: updatedLocation, isSuccess: isSuccessFetchUpdatedLocation } =
    useGetOneLocationQuery(fetchLocationId);

  useEffect(() => {
    if (isSuccessFetchUpdatedLocation) {
      dispatch(locationsActions.updateSingleLocation(updatedLocation));
      setFetchLocationId(skipToken);
    }
  }, [isSuccessFetchUpdatedLocation, updatedLocation, dispatch]);

  const [isFlavorSelected, setIsFlavorSelected] = useState(false);

  const flavorRef = useRef<HTMLIonLabelElement>(null);

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
    if (selectedLocation) setValue('location', selectedLocation.name);
  }, [selectedLocation, setValue]);

  const onSubmit: SubmitHandler<BewertenFormValues> = async (data) => {
    if (!user) return;
    // TODO: location required mit error message einfügen
    if (!selectedLocation) return;

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
        name: data.flavorName,
        type_fruit: data.type_fruit,
        type_cream: data.type_cream,
        color: {
          primary: data.colors[0].value,
          ...(data.colors?.[1]?.value && { secondary: data.colors[1].value }),
        },
      };

      await triggerAddFlavor({
        comment_id: createdComment._id,
        location_id: selectedLocation._id,
        user_id: user._id,
        flavorData,
      }).unwrap();

      dispatch(
        userActions.addFlavorToUserFavoriteFlavors({ ...flavorData, _id: String(Date.now()) })
      );

      // replace data of updated loc in locations array
      setFetchLocationId(selectedLocation._id);
      // clean flavor for next comment
      dispatch(flavorActions.resetFlavor());

      // delay is needed, otherwise memory leak if state updates on unmounted component
      setTimeout(() => setSuccess(true), 500);
    } catch (err: any) {
      dispatch(appActions.setError(err.message));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }

    dispatch(appActions.setIsLoading(false));
  };

  const handleSelectFlavor = (flavorSelect: Flavor) => {
    const { name, type_fruit, type_cream, color } = flavorSelect;

    setValue('flavorName', name);
    setValue('type_fruit', type_fruit);
    setValue('type_cream', type_cream);
    remove([0, 1]);
    append({ value: color.primary });
    color.secondary && append({ value: color.secondary });

    setIsFlavorSelected(true);
    dispatch(flavorActions.setFlavor(flavorSelect));
  };

  const handleRemoveSelectFlavor = () => {
    setValue('flavorName', '');
    setValue('type_fruit', false);
    setValue('type_cream', false);
    remove([0, 1]);
    append({ value: '' });

    setIsFlavorSelected(false);
    dispatch(flavorActions.resetFlavor());
  };

  const handleChangeToggleGroup = ({ name, value }: { name: string; value: boolean }) => {
    handleChangeFlavorTypeToggleGroup(setValue, { name, value });
  };

  const handleScrollIntoView = () => flavorRef?.current?.scrollIntoView({ behavior: 'smooth' });

  const successSection = (
    <div className='container-content--center'>
      <IonCard>
        <IonCardContent>
          <IonCardTitle>Danke für deine Bewertung</IonCardTitle>
          <IonButton
            fill='clear'
            className='button--check button--check-large my-3 mx-5'
            expand='block'
            onClick={() => {
              setSuccess(false);
              reset(); // Reset React Hook Form
            }}
          >
            <IonIcon className='pe-1' size='small' icon={starHalfOutline} />
            Weitere Bewertung
          </IonButton>
        </IonCardContent>
      </IonCard>
    </div>
  );

  return (
    <PageWrapper
      srcHeaderImageLigth='./assets/header-bewerten-light.svg'
      srcHeaderImageDark='./assets/header-bewerten-dark.svg'
    >
      {!isAuth || !user ? (
        <Spinner />
      ) : (
        <>
          {success && successSection}

          {!success && (
            <section className='container-content'>
              <IonItem
                lines='none'
                className='item--small item-text--small item--card-background mb-1'
              >
                <div className='ion-text-wrap bewerten-title'>Bewerte 1 Eissorte</div>
                <Popover>
                  <div className='info-popover__content'>
                    Damit eine Bewertung fix zu tippen ist, bezieht sie sich auf 1 Eissorte.
                    Natürlich kannst du auch weitere Bewertungen abgeben.
                  </div>
                </Popover>
              </IonItem>

              <form className='mt-1' onSubmit={handleSubmit(onSubmit)}>
                <CustomSearchLocation
                  control={control}
                  name='location'
                  label='Eisladen'
                  placeholder='Eisladen oder Stadt suchen'
                  rules={{ required: 'Ohne Eisladen, keine Bewertung' }}
                >
                  <Popover>
                    <div className='info-popover__content'>
                      Nichts gefunden? Trage den Eisladen auf der Karte ein.
                    </div>
                  </Popover>
                </CustomSearchLocation>

                <PricingRange
                  className='item--card-background mt-1'
                  name='pricing'
                  control={control}
                  rules={{ min: { value: 0.1, message: 'Wähle einen Preis aus' } }}
                />

                <CustomSearchFlavor
                  control={control}
                  name='flavorName'
                  label='Eissorte'
                  placeholder='Eissorte suchen oder eintippen'
                  rules={{ required: 'Trage eine Eissorte ein' }}
                  onFlavorSelected={handleSelectFlavor}
                  onFlavorRemoveSelected={handleRemoveSelectFlavor}
                >
                  <Popover>
                    <div className='info-popover__content'>
                      Wähle aus den bereits verfügbaren Eissorten oder tippe einen neuen Namen ein.
                    </div>
                  </Popover>
                </CustomSearchFlavor>

                <IonItem lines='inset' className='item--card-background'>
                  <Checkbox
                    name='type_fruit'
                    label='Sorbet • Fruchteis'
                    control={control}
                    disabled={!!flavor?.name}
                  />
                </IonItem>
                <IonItem lines='inset' className='item--card-background'>
                  <Checkbox
                    name='type_cream'
                    label='Creme • Milch • Pflanzendrink-Eis'
                    control={control}
                    disabled={!!flavor?.name}
                  />
                </IonItem>
                <IonItem lines='none' className='item--small item--card-background'>
                  <IonLabel
                    ref={flavorRef}
                    className='mb-1'
                    position='stacked'
                    color={(errors.colors?.[0] || errors.colors?.[1]) && 'danger'}
                  >
                    Farbe(n) Eis (1 oder 2)
                  </IonLabel>
                  <IonIcon
                    className={`info-icon ${isFlavorSelected && 'info-icon--disabled'}`}
                    slot='end'
                    icon={fields.length === 1 ? addCircleSharp : removeCircleSharp}
                    onClick={() => {
                      if (!isFlavorSelected) {
                        fields.length === 1 ? append({ value: '' }) : remove(1);
                      }
                    }}
                  />
                </IonItem>
                <div className={errors.colors?.[0] || errors.colors?.[1] ? '' : 'mb-1'}>
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
                      disabled={isFlavorSelected}
                    />
                  ))}
                </div>

                {(errors.colors?.[0] || errors.colors?.[1]) && (
                  <IonItem lines='none' className='item--smallest item--card-background mb-1'>
                    <p className='paragraph--error-small'>{errors.colors?.[0].value?.message}</p>
                  </IonItem>
                )}

                <IonItem lines='none' className='item--card-background mb-1'>
                  <TextareaInput
                    control={control}
                    name='text'
                    label='Kommentar'
                    rules={{ required: 'Was möchtest du über den Eisladen teilen?' }}
                  >
                    <p className='text--small-light'>
                      ... Geschmack, Konsistenz, Waffel, Preis-Leistung, Zusatzleistungen wie vegane
                      Sahne, Waffeln oder Soßen, Freundlichkeit ...
                    </p>
                  </TextareaInput>
                </IonItem>

                <IonItem lines='none' className='rating--bewerten-page item--card-background mb-1'>
                  <RatingInput
                    name='rating_quality'
                    label='Eis-Erlebnis'
                    control={control}
                    rules={{
                      required: 'Die Sterne fehlen',
                      min: {
                        value: 0.5 * factorToConvertRatingScale,
                        message: 'Die Sterne fehlen',
                      },
                    }}
                    className='react-stars--bewerten-page'
                  >
                    <p className='text--small-light'>
                      ... gewählte Eiskugel, Waffel, dein Eindruck vom Eisladen ...
                    </p>
                  </RatingInput>
                </IonItem>

                {/* TODO: Error Message */}
                <IonItem lines='none' className='item--small item--card-background'>
                  <IonLabel className='mb-1' position='stacked'>
                    Mein Eis war ...
                  </IonLabel>
                </IonItem>
                <IonItem lines='inset' className='item--card-background'>
                  <Checkbox
                    name='bio'
                    label='bio'
                    control={control}
                    onToggleClick={handleChangeToggleGroup}
                  />
                </IonItem>
                <IonItem lines='inset' className='item--card-background'>
                  <Checkbox
                    name='vegan'
                    label='vegan'
                    control={control}
                    onToggleClick={handleChangeToggleGroup}
                  />
                </IonItem>
                <IonItem lines='inset' className='item--card-background'>
                  <Checkbox
                    name='lactose_free'
                    label='laktosefrei'
                    control={control}
                    onToggleClick={handleChangeToggleGroup}
                  />
                </IonItem>
                <IonItem lines='none' className='item--card-background mb-1'>
                  <Checkbox
                    name='not_specified'
                    label='weiß nicht'
                    control={control}
                    onToggleClick={handleChangeToggleGroup}
                  />
                </IonItem>

                <IonItem lines='none' className='rating--bewerten-page item--card-background mb-1'>
                  <RatingInput
                    name='rating_vegan_offer'
                    label='Veganes Angebot Eisladen'
                    control={control}
                    rules={{
                      required: 'Die Sterne fehlen',
                      min: {
                        value: 0.5 * factorToConvertRatingScale,
                        message: 'Die Sterne fehlen',
                      },
                    }}
                    className='react-stars--bewerten-page'
                  >
                    <p className='text--small-light'>
                      ... viele vegane Sorten, vegane Waffeln, vegane Sahne, vegane Sauce ...
                    </p>
                  </RatingInput>
                </IonItem>

                <IonItem lines='none' className='item--card-background mb-1'>
                  <IonLabel position='stacked'>Datum</IonLabel>
                  <DatePicker name='date' control={control} />
                </IonItem>

                <IonButton
                  fill='clear'
                  className='button--check button--check-large my-3 mx-5'
                  type='submit'
                  expand='block'
                >
                  <IonIcon className='pe-1' size='small' icon={starHalfOutline} />
                  Bewertung abgeben
                </IonButton>
              </form>
            </section>
          )}
        </>
      )}
    </PageWrapper>
  );
};

export default Bewerten;

import { VFC } from 'react';
import type { Comment } from '../../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { userActions } from '../../store/userSlice';
import { showActions } from '../../store/showSlice';
import { appActions } from '../../store/appSlice';
import { getSelectedLocation, locationsActions } from '../../store/locationsSlice';
// @ts-ignore: No Type Declarations in Package
import ReactStars from 'react-rating-stars-component';
import { Rating } from 'react-simple-star-rating';
import { Controller, SubmitHandler, useController, useForm } from 'react-hook-form';
import { IonButton, IonIcon, IonTextarea, IonToggle } from '@ionic/react';
import { backspaceOutline, chatboxEllipses, checkboxOutline } from 'ionicons/icons';
import LoadingError from '../LoadingError';

const tooltipArray = [
  'nie wieder',
  'mangelhaft',
  'ganz schlecht',
  'schlecht',
  'unterdurchschnittlich',
  'durchschnittlich',
  'gut',
  'sehr gut',
  'hervorragend',
  'traumhaft',
];
const fillColorArray = [
  '#f17a45',
  '#f17a45',
  '#f19745',
  '#f19745',
  '#f1a545',
  '#f1a545',
  '#f1b345',
  '#f1b345',
  'var(--ion-color-primary-tint',
  'var(--ion-color-primary)',
];

export interface UpdateCommentFormValues {
  text: string;
  rating_quality: number | null;
  bio: boolean;
  vegan: boolean;
  lactose_free: boolean;
  not_specified: boolean;
  rating_vegan_offer: number | null;
}

interface Props {
  comment: Comment;
}

const UpdateComment: VFC<Props> = ({ comment }) => {
  const dispatch = useAppDispatch();
  const selectedLocation = useAppSelector(getSelectedLocation);

  const defaultValues: UpdateCommentFormValues = {
    text: comment.text,
    rating_quality: comment.rating_quality,
    bio: comment.bio,
    vegan: comment.vegan,
    lactose_free: comment.lactose_free,
    not_specified: comment.not_specified,
    rating_vegan_offer: comment.rating_vegan_offer,
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateCommentFormValues>({ defaultValues });

  const unCheckToggles = () => {
    setValue('bio', false);
    setValue('vegan', false);
    setValue('lactose_free', false);
  };

  const unCheckNotSpecified = () => {
    setValue('not_specified', false);
  };

  const checkLactoseFree = () => {
    setValue('lactose_free', true);
  };

  const onSubmit: SubmitHandler<UpdateCommentFormValues> = async (data) => {
    dispatch(appActions.setIsLoading(true));
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      let body = {
        location_id: comment.location_id,
        flavors_referred: comment.flavors_referred,
        text: data.text,
        rating_quality: data.rating_quality,
        bio: data.bio,
        vegan: data.vegan,
        lactose_free: data.lactose_free,
        not_specified: data.not_specified,
        rating_vegan_offer: data.rating_vegan_offer,
        date: comment.date,
      };

      const options: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        // converts JS data into JSON string.
        body: JSON.stringify(body),
        credentials: 'include',
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${comment._id}`, options);
      const updatedComment = await res.json();

      dispatch(userActions.updateCommentsListFromUser(updatedComment));

      // Important to distinguish between Update on Profil and Location Info Modal
      if (selectedLocation) {
        dispatch(locationsActions.updateCommentFromSelectedLocation(updatedComment));
      }
    } catch (error) {
      console.log(error);
      dispatch(appActions.setError('Da ist etwas schief gelaufen. Versuche es später nochmal.'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
    dispatch(showActions.setShowEditSectionComment({ state: false, comment_id: '' }));
    dispatch(appActions.setIsLoading(false));
  };

  const {
    field: {
      onChange: onChangeTextarea,
      name: nameTextarea,
      value: valueTextarea,
      ref: refTextarea,
    },
    fieldState: { error: errorTextarea },
  } = useController({
    name: 'text',
    control,
    rules: { required: 'Was möchtest du über den Eisladen teilen?' },
  });

  const {
    field: { onChange: onChangeRatingQuality, value: valueRatingQuality },
    fieldState: { error: errorRatingQuality },
  } = useController({
    name: 'rating_quality',
    control,
    rules: { required: 'Die Sterne fehlen', min: 0.5 },
    defaultValue: 3,
  });

  const {
    field: { onChange: onChangeRatingVeganOffer, value: valueRatingVeganOffer },
    fieldState: { error: errorRatingVeganOffer },
  } = useController({
    name: 'rating_vegan_offer',
    control,
    rules: { required: 'Die Sterne fehlen', min: 0.5 },
  });

  return (
    <form key={comment._id} onSubmit={handleSubmit(onSubmit)}>
      <div className='px-3 py-2 borderBottom'>
        <div className='commentText'>
          <IonIcon slot='start' className='me-2' color='text-color' icon={chatboxEllipses} />
          Kommentar
          <IonTextarea
            className='pb-2'
            name={nameTextarea}
            ref={refTextarea}
            value={valueTextarea}
            autoGrow={true}
            rows={1}
            onIonChange={(event) => onChangeTextarea(event.detail.value)}
          />
          {errorTextarea && <p>{errorTextarea.message}</p>}
        </div>

        <div className='d-flex align-items-center'>
          <div className='rating'>
            <div>Veganes Angebot</div>
            <div className='react-stars-component'>
              {/* TODO: Validation does NOT work */}
              <Rating
                className='react-stars'
                ratingValue={valueRatingQuality as number}
                onClick={(rate: number) => onChangeRatingQuality(rate)}
                iconsCount={5}
                size={15}
                allowHalfIcon={true}
                allowHover={true}
                transition={true}
                readonly={false}
                showTooltip={true}
                tooltipClassName='react-stars__tooltip'
                tooltipDefaultText='Bewertung'
                tooltipArray={tooltipArray}
                fillColorArray={fillColorArray}
                emptyColor='#cccccc90'
                fillColor='var(--ion-color-primary)'
              />
              {errorRatingQuality && <p>{errorRatingQuality.message}</p>}
            </div>
            <div>Eis-Erlebnis</div>
            <div className='react-stars-component'>
              <Rating
                className='react-stars'
                ratingValue={valueRatingVeganOffer as number}
                initialValue={defaultValues.rating_vegan_offer as number}
                onClick={(rate: number) => onChangeRatingVeganOffer(rate)}
                iconsCount={5}
                size={15}
                allowHalfIcon={true}
                allowHover={true}
                transition={true}
                readonly={false}
                showTooltip={true}
                tooltipClassName='react-stars__tooltip'
                tooltipDefaultText='Bewertung'
                tooltipArray={tooltipArray}
                fillColorArray={fillColorArray}
                emptyColor='#cccccc90'
                fillColor='var(--ion-color-primary)'
              />
              {errorRatingVeganOffer && <p>{errorRatingVeganOffer.message}</p>}
            </div>
          </div>
        </div>
        <div className='mt-3'>
          <div className='commentText'>Mein Eis-Erlebnis war ...</div>
          <div className='row mt-2'>
            <div className='col'>
              <div className='itemTextSmall mb-1'>bio</div>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonToggle
                    onIonChange={(e) => {
                      onChange(e.detail.checked);
                      e.detail.checked && unCheckNotSpecified();
                    }}
                    checked={value}
                  />
                )}
                name='bio'
              />
            </div>
            <div className='col'>
              <div className='itemTextSmall mb-1'>vegan</div>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonToggle
                    onIonChange={(e) => {
                      onChange(e.detail.checked);
                      e.detail.checked && unCheckNotSpecified();
                      e.detail.checked && checkLactoseFree();
                    }}
                    checked={value}
                  />
                )}
                name='vegan'
              />
            </div>
            <div className='col'>
              <div className='itemTextSmall mb-1'>laktosefrei</div>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonToggle
                    onIonChange={(e) => {
                      onChange(e.detail.checked);
                      e.detail.checked && unCheckNotSpecified();
                    }}
                    checked={value}
                  />
                )}
                name='lactose_free'
              />
            </div>
            <div className='col'>
              <div className='itemTextSmall mb-1'>weiß nicht</div>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonToggle
                    onIonChange={(e) => {
                      onChange(e.detail.checked);
                      e.detail.checked && unCheckToggles();
                    }}
                    checked={value}
                  />
                )}
                name='not_specified'
              />
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center mt-1'>
          <IonButton className='check-btn' type='submit'>
            <IonIcon className='pe-1' size='small' icon={checkboxOutline} />
            Updaten
          </IonButton>
          <IonButton
            className='check-btn'
            onClick={() =>
              dispatch(showActions.setShowEditSectionComment({ state: false, comment_id: '' }))
            }
          >
            <IonIcon className='pe-1' size='small' icon={backspaceOutline} />
            Abbrechen
          </IonButton>
        </div>
      </div>

      <LoadingError />
    </form>
  );
};

export default UpdateComment;

import { VFC } from 'react';
import type { Comment } from '../../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { userActions } from '../../store/userSlice';
import { showActions } from '../../store/showSlice';
import { appActions } from '../../store/appSlice';
import { getSelectedLocation, locationsActions } from '../../store/locationsSlice';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { backspaceOutline, chatboxEllipses, checkboxOutline } from 'ionicons/icons';
import LoadingError from '../LoadingError';
import TextareaInput from '../FormFields/TextareaInput';
import RatingInput from '../FormFields/RatingInput';
import Checkbox from '../FormFields/Checkbox';
import {
  convertIntoNumberFrom0To100,
  convertIntoNumberFrom0To5,
  factorToConvertRatingScale,
  handleChangeFlavorTypeToggleGroup,
} from '../../utils/variables-and-functions';

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
    rating_quality: convertIntoNumberFrom0To100(comment.rating_quality as number),
    bio: comment.bio,
    vegan: comment.vegan,
    lactose_free: comment.lactose_free,
    not_specified: comment.not_specified,
    rating_vegan_offer: convertIntoNumberFrom0To100(comment.rating_vegan_offer as number),
  };

  const { control, handleSubmit, setValue } = useForm<UpdateCommentFormValues>({
    defaultValues,
  });

  const handleChangeToggleGroup = ({ name, value }: { name: string; value: boolean }) => {
    handleChangeFlavorTypeToggleGroup(setValue, { name, value });
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
        rating_quality: convertIntoNumberFrom0To5(data.rating_quality as number),
        bio: data.bio,
        vegan: data.vegan,
        lactose_free: data.lactose_free,
        not_specified: data.not_specified,
        rating_vegan_offer: convertIntoNumberFrom0To5(data.rating_vegan_offer as number),
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

  return (
    <form key={comment._id} onSubmit={handleSubmit(onSubmit)}>
      <div className='px-3 py-2 borderBottom'>
        <div className='commentText'>
          <IonIcon slot='start' className='me-2' color='text-color' icon={chatboxEllipses} />
          Kommentar
          <TextareaInput
            name='text'
            control={control}
            rules={{ required: 'Was möchtest du über den Eisladen teilen?' }}
          />
        </div>
        <div className='d-flex align-items-center'>
          <div className='rating'>
            <div>Veganes Angebot</div>
            <RatingInput
              name='rating_quality'
              control={control}
              rules={{ required: 'Die Sterne fehlen', min: 0.5 * factorToConvertRatingScale }}
            />
            <div>Eis-Erlebnis</div>
            <RatingInput
              name='rating_vegan_offer'
              control={control}
              rules={{ required: 'Die Sterne fehlen', min: 0.5 * factorToConvertRatingScale }}
            />
          </div>
        </div>
        <div className='mt-3'>
          <div className='commentText'>Mein Eis-Erlebnis war ...</div>
          <IonItem lines='inset'>
            <Checkbox
              name='bio'
              label='bio'
              control={control}
              onToggleClick={handleChangeToggleGroup}
            />
          </IonItem>
          <IonItem lines='inset'>
            <Checkbox
              name='vegan'
              label='vegan'
              control={control}
              onToggleClick={handleChangeToggleGroup}
            />
          </IonItem>
          <IonItem lines='inset'>
            <Checkbox
              name='lactose_free'
              label='laktosefrei'
              control={control}
              onToggleClick={handleChangeToggleGroup}
            />
          </IonItem>
          <IonItem lines='none'>
            <Checkbox
              name='not_specified'
              label='weiß nicht'
              control={control}
              onToggleClick={handleChangeToggleGroup}
            />
          </IonItem>
        </div>
        <div className='d-flex justify-content-center mt-1'>
          <IonButton className='button--check' type='submit' fill='clear'>
            <IonIcon className='pe-1' size='small' icon={checkboxOutline} />
            Updaten
          </IonButton>
          <IonButton
            className='button--check'
            fill='clear'
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

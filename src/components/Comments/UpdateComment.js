import { useContext } from 'react';
import { Context } from "../../context/Context";
import ReactStars from "react-rating-stars-component";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonIcon, IonTextarea, IonToggle } from '@ionic/react';
import { backspaceOutline, chatboxEllipses, checkboxOutline } from 'ionicons/icons';
import showError from '../showError';
import LoadingError from '../LoadingError';

const UpdateComment = ({comment}) => {
  const {
    user, setUser,
    setLoading,
    setError,
    setShowUpdateComment,
    selected, setSelected,
  } = useContext(Context);

  const defaultValues = {
    text: comment.text,
    rating_quality: comment.rating_quality,
    bio: comment.bio,
    vegan: comment.vegan,
    lactose_free: comment.lactose_free,
    not_specified: comment.not_specified,
    rating_vegan_offer: comment.rating_vegan_offer,
  }

  // Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues
  });

  const unCheckToggles = () => {
    setValue("bio", false);
    setValue("vegan", false);
    setValue("lactose_free", false);
  }

  const unCheckNotSpecified = () => {
    setValue("not_specified", false);
  }

  const checkLactoseFree = () => {
    setValue("lactose_free", true);
  }

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
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
      }

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token
        },
        // converts JS data into JSON string.
        body: JSON.stringify(body),
        credentials: "include",
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${comment._id}`, options);
      const updatedComment = await res.json();

      // copy users comments_list with spread syntax, find index of comment that should be updated
      // put updated comment at this index position, finally update user data
      const comments_list = [...user.comments_list]
      const index = user.comments_list.findIndex(item => item._id === comment._id);
      comments_list.splice(index, 1, updatedComment);
      setUser({...user, comments_list})
     
      if(selected) {
        // set new comments list
        const comments_list = [...selected.comments_list]
        const index = selected.comments_list.findIndex(item => item._id === comment._id);
        comments_list.splice(index, 1, updatedComment);
        // calc new avg ratings without fetching data from API - rounded to one decimal
        const sumQuality = comments_list.reduce((a, b) => a.rating_quality + b.rating_quality);
        const sumVegan = comments_list.reduce((a, b) => a.rating_vegan_offer + b.rating_vegan_offer);
        const location_rating_quality = Math.round( (sumQuality / comments_list.length) * 10) / 10 || 0;
        const location_rating_vegan_offer = Math.round( (sumVegan / comments_list.length) * 10) / 10 || 0;

        setSelected({...selected, comments_list, location_rating_quality, location_rating_vegan_offer})
      }
    } catch (error) {
      console.log(error);
      setError('Da ist etwas schief gelaufen. Versuche es später nochmal.')
      setTimeout(() => setError(null), 5000);
    };
    setShowUpdateComment({state: false, comment_id: ''})
    setLoading(false);
  }

  return (
    <form key={comment._id} onSubmit={handleSubmit(onSubmit)}>
      <div className="px-3 py-2 borderBottom">
        <div className="commentText">
          <IonIcon slot="start" className="me-2" color='text-color' icon={chatboxEllipses}/>Kommentar
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <IonTextarea
                className="pb-2"
                autoGrow={true}
                rows="1"
                value={value} 
                onIonChange={e => onChange(e.detail.value)} 
              />
            )}
            name="text"
            rules={{ required: true }}
          />
        </div>
        {showError("text", errors)}

        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center py-1 itemTextSmall">
            <div className="me-2">
              <div className="ratingContainer">Veganes Angebot</div>
              <div className="ratingContainer">Eis-Erlebnis</div>
            </div>
            <div>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ReactStars
                    className="react-stars"
                    count={5}
                    value={value}
                    isHalf={true}
                    onChange={e => onChange(e)}
                    edit={true}
                    size={18}
                    color1='#cccccc90'
                    color2='var(--ion-color-primary)'
                  />
                )}
                name="rating_vegan_offer"
                rules={{ required: true, min: 0.5 }}
              />
              {showError("rating_vegan_offer", errors)}

              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ReactStars
                    className="react-stars"
                    count={5}
                    value={value}
                    isHalf={true}
                    onChange={e => onChange(e)}
                    edit={true}
                    size={18}
                    color1='#cccccc90'
                    color2='var(--ion-color-primary)'
                  />
                )}
                name="rating_quality"
                rules={{ required: true, min: 0.5 }}
              />
              {showError("rating_quality", errors)}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="commentText">Mein Eis-Erlebnis war ...</div>
          <div className="row mt-2">
            <div className="col">
              <div className="itemTextSmall mb-1">bio</div>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonToggle
                    onIonChange={e => {
                      onChange(e.detail.checked);
                      e.detail.checked && unCheckNotSpecified();
                    }} 
                    checked={value} />
                  )}
                name="bio"
              />
            </div>
            <div className="col">
              <div className="itemTextSmall mb-1">vegan</div>
              <Controller 
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonToggle 
                    onIonChange={e => {
                      onChange(e.detail.checked);
                      e.detail.checked && unCheckNotSpecified();
                      e.detail.checked && checkLactoseFree();
                    }} 
                    checked={value} 
                  />
                )}
                name="vegan"
              />
            </div>
            <div className="col">
              <div className="itemTextSmall mb-1">laktosefrei</div>
              <Controller 
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonToggle 
                    onIonChange={e => {
                      onChange(e.detail.checked);
                      e.detail.checked && unCheckNotSpecified();
                    }} 
                    checked={value} 
                  />
                )}
                name="lactose_free"
              />
            </div>
            <div className="col">
              <div className="itemTextSmall mb-1">weiß nicht</div>
              <Controller 
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonToggle 
                    onIonChange={e => {
                      onChange(e.detail.checked);
                      e.detail.checked && unCheckToggles();
                    }} 
                    checked={value}
                  />
                )}
                name="not_specified"
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-1">
          <IonButton className="check-btn" type="submit">
            <IonIcon className="pe-1" size="small" icon={checkboxOutline}/>Updaten
          </IonButton>
          <IonButton className="check-btn" onClick={() => setShowUpdateComment({state: false, comment_id: ''})} >
            <IonIcon className="pe-1" size="small" icon={backspaceOutline}/>Abbrechen
          </IonButton>
        </div>
      </div>

      <LoadingError />
    
    </form>
  )
}

export default UpdateComment

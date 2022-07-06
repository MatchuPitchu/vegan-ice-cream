import { VFC } from 'react';
// EmailJS https://www.emailjs.com/docs/examples/reactjs/
import emailjs from '@emailjs/browser';
// Redux Store
import { useAppDispatch } from '../store/hooks';
import { showActions } from '../store/showSlice';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
} from '@ionic/react';
import { closeCircleOutline, paperPlaneOutline } from 'ionicons/icons';
import TextareaInput from './FormFields/TextareaInput';
import { CustomInput } from './FormFields/CustomInput';
import Select from './FormFields/Select';
import { appActions } from '../store/appSlice';

interface FeedbackForm {
  name: string;
  email: string;
  message: string;
  rating: string;
  recommend: string;
}

const defaultFeedbackValues: FeedbackForm = {
  name: '',
  email: '',
  message: '',
  rating: '',
  recommend: '',
};

type SendFeedback = {
  name: string;
  reply_to: string;
  message: string;
  rating_App: string;
  recommend_App: string;
} & Record<string, string>;

const templateID = 'contact-form';
const serviceID = 'gmail_account';

const Feedback: VFC = () => {
  const dispatch = useAppDispatch();

  const { control, handleSubmit, reset } = useForm({ defaultValues: defaultFeedbackValues });

  const sendFeedback = async (serviceID: string, templateId: string, variables: SendFeedback) => {
    try {
      const response = await emailjs.send(
        serviceID,
        templateId,
        variables as Record<string, string>,
        process.env.REACT_APP_USER_ID_EMAILJS
      );
      if (response) console.log('Email successfully sent!');
    } catch (error) {
      dispatch(
        appActions.setError(
          'Ups, schief gelaufen. Schreibe bitte eine direkte Nachricht an die Mailadresse, die unter "About" angegeben ist.'
        )
      );
      setTimeout(() => dispatch(appActions.resetError()), 5000);
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<FeedbackForm> = async ({
    name,
    email,
    message,
    rating,
    recommend,
  }) => {
    alert(`Danke für deine Nachricht, ${name}`);

    await sendFeedback(serviceID, templateID, {
      name,
      reply_to: email,
      message,
      rating_App: rating,
      recommend_App: recommend,
    });

    reset(defaultFeedbackValues);
    dispatch(showActions.setShowFeedback(false));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonItem lines='none'>
          <IonLabel color='primary'>Feedback</IonLabel>
          <IonButton
            slot='end'
            fill='clear'
            onClick={() => dispatch(showActions.setShowFeedback(false))}
          >
            <IonIcon icon={closeCircleOutline} />
          </IonButton>
        </IonItem>
      </IonHeader>
      <IonContent className='ion-padding'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem lines='none' className='mb-1'>
            <CustomInput
              control={control}
              name='name'
              label='Name'
              rules={{ required: 'Bitte ergänze deinen Namen' }}
              isFocusedOnMount={true}
            />
          </IonItem>

          <IonItem lines='none' className='mb-1'>
            <CustomInput
              control={control}
              name='email'
              label='E-Mail'
              inputmode='email'
              rules={{ required: 'Bitte ergänze deine E-Mail' }}
            />
          </IonItem>

          <IonItem lines='none' className='mb-1'>
            <TextareaInput
              control={control}
              name='message'
              label='Nachricht'
              rules={{ required: 'Bitte ergänze deine Nachricht' }}
            />
          </IonItem>

          <IonItem lines='none' className='mb-1'>
            <Select
              control={control}
              name='rating'
              label='Wie gefällt dir die App?'
              options={[
                { value: '1', label: 'ausgezeichnet' },
                { value: '2', label: 'sehr gut' },
                { value: '3', label: 'ganz ok' },
                { value: '4', label: 'verbesserungswürdig' },
                { value: '5', label: 'nicht hilfreich' },
              ]}
            />
          </IonItem>

          <IonItem lines='none' className='mb-1'>
            <Select
              control={control}
              name='recommend'
              label='Würdest du die App weiterempfehlen?'
              options={[
                { value: '1', label: 'ja, absolut' },
                { value: '2', label: 'eher ja' },
                { value: '3', label: 'eher nein' },
                { value: '4', label: 'nein' },
                { value: '-1', label: 'weiß nicht' },
              ]}
            />
          </IonItem>

          <IonButton
            fill='clear'
            className='button--check button--check-large my-3'
            type='submit'
            expand='block'
          >
            <IonIcon className='pe-1' icon={paperPlaneOutline} />
            Absenden
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Feedback;

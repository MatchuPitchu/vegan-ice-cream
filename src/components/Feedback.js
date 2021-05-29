import { useContext } from 'react';
import { Context } from "../context/Context";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { closeCircleOutline, mailUnread } from 'ionicons/icons';
import showError from './showError';

// Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started

const defaultValues = { 
  name: '',
  email: '',
  message: '',
  rating: '',
  recommend: ''
}

const Feedback = () => {
  const { setShowFeedback } = useContext(Context);
  // with formState I can retrieve errors obj
  const { control, handleSubmit, reset, formState: { errors } } = useForm({defaultValues});

  const sendFeedback = async (serviceID, templateId, variables) => {
    try {
      const res = await window.emailjs.send(serviceID, templateId, variables)
      if(res) console.log('Email successfully sent!')
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    alert(`Danke für deine Nachricht, ${data.name}`);
    const templateID = 'contact-form';
    const serviceID = 'gmail_account'
    sendFeedback(serviceID, templateID, { 
      name: data.name,
      reply_to: data.email,
      message: data.message,
      rating_App: data.rating,
      recommend_App: data.recommend
    });
    reset(defaultValues);
    setShowFeedback(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonItem lines="none">
          <IonLabel color="primary">Feedback</IonLabel>
          <IonButton slot="end" fill="clear" onClick={() => setShowFeedback(false)}><IonIcon icon={closeCircleOutline}/></IonButton>
        </IonItem>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem lines="none" className="mb-1">
            <IonLabel position='floating' htmlFor="name">Name</IonLabel>
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                )}
                name="name"
                rules={{ required: true }}
              />
          </IonItem>
          {showError("name", errors)}

          <IonItem lines="none" className="mb-1">
            <IonLabel position='floating' htmlFor="email">E-Mail</IonLabel>
            <Controller 
              control={control}
              render={({ field: { onChange, value } }) => (
                <IonInput type="email" inputmode="email" value={value} onIonChange={e => onChange(e.detail.value)} />
              )}
              name="email"
              rules={{ required: true }}
            />
          </IonItem>
          {showError("email", errors)}

          <IonItem lines="none" className="mb-1">
            <IonLabel position='floating' htmlFor="message">Nachricht</IonLabel>
            <Controller 
              control={control}
              render={({ field: { onChange, value } }) => (
                <IonTextarea value={value} onIonChange={e => onChange(e.detail.value)}></IonTextarea>
                )}
                name="message"
                rules={{ required: true }}
                />
          </IonItem>
          {showError("message", errors)}

          <IonItem lines="none" className="mb-1">
            <IonLabel position="stacked" className="ion-text-wrap mb-2" htmlFor="rating">Wie gefällt dir die App?</IonLabel>
            <Controller 
              control={control}
              render={({ field: { onChange, value } }) => (
                <IonSelect
                  cancelText="Abbrechen"
                  placeholder="Auswahl"
                  value={value}
                  onIonChange={e => onChange(e.detail.value)}
                >
                  <IonSelectOption value="1">ausgezeichnet</IonSelectOption>
                  <IonSelectOption value="2">gut</IonSelectOption>
                  <IonSelectOption value="3">ganz ok</IonSelectOption>
                  <IonSelectOption value="4">verbesserungswürdig</IonSelectOption>
                  <IonSelectOption value="5">nicht hilfreich</IonSelectOption>
                </IonSelect>
              )}
              name="rating"
            />
          </IonItem>

          <IonItem lines="none" className="mb-1">
            <IonLabel position="stacked" className="ion-text-wrap mb-2" htmlFor="recommend">Würdest du die App weiterempfehlen?</IonLabel>
            <Controller 
              control={control}
              render={({ field: { onChange, value } }) => (
                <IonSelect
                  cancelText="Abbrechen"
                  placeholder="Auswahl"
                  value={value}
                  onIonChange={e => onChange(e.detail.value)}
                >
                  <IonSelectOption value="1">ja, absolut</IonSelectOption>
                  <IonSelectOption value="2">eher ja</IonSelectOption>
                  <IonSelectOption value="3">eher nein</IonSelectOption>
                  <IonSelectOption value="4">nein</IonSelectOption>
                  <IonSelectOption value="-1">weiß nicht</IonSelectOption>
                </IonSelect>
              )}
              name="recommend"
            />
          </IonItem>
          
          <IonButton className="mt-3" type="submit" expand="block"><IonIcon className="pe-1"icon={mailUnread}/>Absenden</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Feedback
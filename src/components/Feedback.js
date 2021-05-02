import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRange, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { iceCream, mailUnread, text } from "ionicons/icons";
import { Controller, useForm } from "react-hook-form";
import { useState } from 'react';

// Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started

const Feedback = () => {
  // with formState I can retrieve errors obj
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm();
  const  [data, setData ] = useState();
  
  const onSubmit = data => {
    console.log('Submit Data: ', data);
    setData(data);
  };

  console.log('Watch:', watch()); // watch input value by passing the name of it as a string, z.B. watch('firstName')
  console.log('Errors:', errors); // every error thrown in form

  // error handler function to display error message from react-hook-form hook
  // library creates object as part of the hook that holds the errors that are 
  // generated when form is validated.
  const showError = (_fieldName) => {
    {
      return (
        (errors)[_fieldName] && (
          <div className='alertMsg'>
            {_fieldName === 'name' && 'Bitte tragen Sie Ihren Namen ein'}
            {_fieldName === 'email' && 'Ihre Mail-Adresse fehlt'}
            {_fieldName === 'message' && 'Ops, das Textfeld ist noch leer'}
          </div>
        )
      );
    }
  };
  
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Feedback</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">

      {/* // See input fields in console
      // <form onSubmit={handleSubmit(data => console.log(data))}>
      // "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <IonItem lines="none" className="mb-1">
          <IonLabel position='floating'>Name</IonLabel>
          <Controller
              control={control}
              render={({ 
                field: { onChange, value },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <IonInput inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
              )}
              name="name"
              errors="test"
              rules={{ required: true }}
            />
        </IonItem>

        {showError("name")}
        <IonItem lines="none" className="mb-1">
          <IonLabel position='floating'>E-Mail</IonLabel>
          <Controller 
            control={control}
            render={({ 
              field: { onChange, value },
              fieldState: { invalid, isTouched, isDirty, error },
            }) => (
              <IonInput type="email" inputmode="email" value={value} onIonChange={e => onChange(e.detail.value)} />
            )}
            name="email"
            rules={{ required: true }}
          />
        </IonItem>
        {showError("email")}

        <IonItem lines="none" className="mb-1">
          <IonLabel position='floating'>Nachricht</IonLabel>
          <Controller 
            control={control}
            render={({ 
              field: { onChange, value },
              fieldState: { invalid, isTouched, isDirty, error },
            }) => (
              <IonTextarea value={value} onIonChange={e => onChange(e.detail.value)}></IonTextarea>
              )}
              name="message"
              rules={{ required: true }}
              />
        </IonItem>
        {showError("message")}

        <IonItem lines="none" className="mb-1">
          <IonLabel position="stacked" className="ion-text-wrap mb-2">Wie gefällt Ihnen die App?</IonLabel>
          <Controller 
            control={control}
            render={({ 
              field: { onChange, value },
              fieldState: { invalid, isTouched, isDirty, error },
            }) => (
              <IonSelect
                placeholder="Auswahl"
              >
                <IonSelectOption value="1">ausgezeichnet</IonSelectOption>
                <IonSelectOption value="2">gut</IonSelectOption>
                <IonSelectOption value="3">ganz ok</IonSelectOption>
                <IonSelectOption value="4">verbesserungswürdig</IonSelectOption>
                <IonSelectOption value="5">absolut nicht hilfreich</IonSelectOption>
              </IonSelect>
            )}
            onChangeName="onIonChange"
            onChange={([selected]) => {
              return selected.detail.value;
            }}
            name="rating"
          />
        </IonItem>

        <IonItem lines="none" className="mb-1">
          <IonLabel position="stacked" className="ion-text-wrap mb-2">Würden Sie die App weiterempfehlen?</IonLabel>
          <Controller 
            control={control}
            render={({ 
              field: { onChange, value },
              fieldState: { invalid, isTouched, isDirty, error },
            }) => (
              <IonSelect
                placeholder="Auswahl"
              >
                <IonSelectOption value="1">ja, absolut</IonSelectOption>
                <IonSelectOption value="2">eher ja</IonSelectOption>
                <IonSelectOption value="3">eher nein</IonSelectOption>
                <IonSelectOption value="4">nein</IonSelectOption>
                <IonSelectOption value="-1">weiß nicht</IonSelectOption>
              </IonSelect>
            )}
            onChangeName="onIonChange"
            onChange={([selected]) => {
              return selected.detail.value;
            }}
            name="recommand"
          />
        </IonItem>

        
        <IonButton className="mt-3" type="submit" expand="block"><IonIcon className="pe-1"icon={mailUnread}/>Absenden</IonButton>
      </form>
    </IonContent>
  </IonPage>
  );
};

export default Feedback
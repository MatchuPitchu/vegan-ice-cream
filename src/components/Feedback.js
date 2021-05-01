import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { iceCream } from "ionicons/icons";
import { useForm } from "react-hook-form";

// Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started

const Feedback = () => {
  // with formState I can retrieve errors obj
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log('Submit Data: ', data);

  console.log('Watch:', watch()); // watch input value by passing the name of it as a string, z.B. watch('firstName')
  console.log('Errors:', errors); // every error thrown in form

  return (
    <IonPage>
    <IonHeader translucent>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home"></IonBackButton>
        </IonButtons>
        <IonTitle>Feedback</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      <IonIcon icon={iceCream}/>

        {/* // See input fields in console
        // <form onSubmit={handleSubmit(data => console.log(data))}>
        // "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='firstName'>First Name</label>
        {/* register your input into the hook by invoking the "register" function */}
        {/* include validation with required or other standard HTML validation rules */}
        <input {...register("firstName", { required: true, maxLength: 4 })} id='firstName' />
        {/* errors will return when field validation fails; prop name comes from ...register("")  */}
        {/* siehe für style mit Warnzeichen css p::before */}
        {errors.firstName && <p>This field is required</p>}
        
        <label htmlFor='lastName'>Last Name</label>
        <input {...register("lastName", { required: 'Required', min: 0, max: 100, maxLength: { value: 4, message: 'You exceeded the max length' }})} id='lastName' />
        {/* Insert error message of required: '...' */}
        {errors.lastName && <p>{errors.lastName.message}</p>}

        <label htmlFor='age'>Age</label>
        {/* num in html is outputed as string, hooks offers way to have directly num */}
        <input type="number" {...register("age", { valueAsNumber: true })} id='age' />
        {errors.age && <p>This field is required</p>}

        {/* Other validation rules than the above rules supported by React Hook form https://react-hook-form.com/api/useform/register
            pattern, validate, valueAsDate, setValueAs */}
        <label htmlFor='city'>City</label>
        <input {...register("city", { pattern: /[A-Za-z] {3}/ })} id='city' />

        <label htmlFor='gender'></label>
        <select {...register("gender")} id='gender' >
          <option value="female">female</option>
          <option value="male">male</option>
          <option value="divers">other</option>
        </select>

        <label htmlFor='developer'>Are you a developer?</label>
        <input {...register("developer")} type='checkbox' />
      
        
        <input type="submit" />
      </form>
    </IonContent>
  </IonPage>
  );
};

export default Feedback
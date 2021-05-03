// error handler function to display error message from react-hook-form hook
// library creates object as part of the hook that holds the errors that are 
// generated when form is validated.
const showError = (_fieldName, errors) => {
  let errorMsg
  if(errors.repeatPassword) errorMsg = errors.repeatPassword.message;

  if(errors) {
    return (
      (errors)[_fieldName] && (
        <div className='alertMsg'>
          {_fieldName === 'name' && 'Bitte trage deinen Namen ein'}
          {_fieldName === 'email' && 'Deine Mail-Adresse fehlt'}
          {_fieldName === 'message' && 'Ops, das Textfeld ist noch leer'}
          {_fieldName === 'password' && 'Bitte trage ein gültiges Passwort ein'}
          {_fieldName === 'repeatPassword' && `${errorMsg}. Schaue, ob die Eingaben übereinstimmen.`}
        </div>
      )
    );
  }
};

export default showError;
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
          {_fieldName === 'name' && 'Bitte trage einen Namen ein'}
          {_fieldName === 'email' && 'Deine Mail-Adresse fehlt'}
          {_fieldName === 'message' && 'Ops, das Textfeld ist noch leer'}
          {_fieldName === 'password' && 'Bitte trage ein gültiges Passwort ein'}
          {_fieldName === 'repeatPassword' && `${errorMsg}. Schaue, ob die Eingaben übereinstimmen.`}
          {_fieldName === 'street' && 'Bitte ergänze die Straße.'}
          {_fieldName === 'number' && 'Hast du eine korrekte Hausnummer eingetragen?'}
          {_fieldName === 'zipcode' && 'Überprüfe die Eingabe der Postleitzahl.'}
          {_fieldName === 'country' && 'Überprüfe die Eingabe des Landes.'}
        </div>
      )
    );
  }
};

export default showError;
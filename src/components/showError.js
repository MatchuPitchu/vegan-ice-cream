// error handler function to display error message from react-hook-form hook
// library creates object as part of the hook that holds the errors that are 
// generated when form is validated.
const showError = (_fieldName, errors) => {
  if(errors) {
    return (
      (errors)[_fieldName] && (
        <div className='alertMsg'>
          {_fieldName === 'name' && 'Bitte trage deinen Namen ein'}
          {_fieldName === 'email' && 'Deine Mail-Adresse fehlt'}
          {_fieldName === 'message' && 'Ops, das Textfeld ist noch leer'}
        </div>
      )
    );
  }
};

export default showError;
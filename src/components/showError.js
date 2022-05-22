// error handler function to display error message from react-hook-form hook
// library creates object as part of the hook that holds the errors that are
// generated when form is validated.
const showError = (_fieldName, errors) => {
  let errorMsg;
  if (errors.repeatedPassword) errorMsg = errors.repeatedPassword.message;

  if (errors) {
    return (
      errors[_fieldName] && (
        <div className='alertMsg'>
          {_fieldName === 'name' && 'Bitte trage einen Namen ein'}
          {_fieldName === 'email' && 'Deine Mail-Adresse fehlt'}
          {_fieldName === 'message' && 'Ops, das Textfeld ist noch leer'}
          {_fieldName === 'newPassword' && 'Bitte trage ein gültiges Passwort ein'}
          {_fieldName === 'password' && 'Bitte trage ein gültiges Passwort ein'}
          {_fieldName === 'repeatedPassword' && `${errorMsg} Schau, ob die Eingaben übereinstimmen`}
          {_fieldName === 'city' &&
            `Du kannst die Stadt jederzeit in deinem Profil ändern. Für deine Kartenansicht wird aber eine Angabe gebraucht`}
          {_fieldName === 'street' && 'Bitte ergänze die Straße'}
          {_fieldName === 'number' && 'Hast du eine korrekte Hausnummer eingetragen?'}
          {_fieldName === 'zipcode' && 'Überprüfe die Eingabe der Postleitzahl'}
          {_fieldName === 'country' && 'Überprüfe die Eingabe des Landes'}
          {_fieldName === 'location' && 'Wähle einen Eisladen'}
          {_fieldName === 'color1' && 'Wähle mindestens 1 Farbe'}
          {_fieldName === 'text' && 'Was möchtest du über den Eisladen teilen?'}
          {_fieldName === 'rating_quality' && 'Die Sterne fehlen noch'}
          {_fieldName === 'rating_vegan_offer' && 'Die Sterne fehlen noch'}
          {_fieldName === 'date' && 'Mit dem Datum stimmt etwas nicht'}
        </div>
      )
    );
  }
};

export default showError;

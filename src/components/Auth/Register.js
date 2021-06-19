import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Context } from "../../context/Context";
import { IonContent, IonInput, IonItem, IonLabel, IonList, IonButton, IonPage, IonHeader, IonIcon, IonCardTitle, IonCardContent, IonCard } from "@ionic/react";
import showError from '../showError';
import { lockClosed, logIn } from "ionicons/icons";
import { citiesArray } from '../arrayCitiesGermany';
import LoadingError from "../LoadingError";

const Register = () => {
  const { 
    setLoading,
    error, setError,
    toggle 
  } = useContext(Context);
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [endRegister, setEndRegister] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    try {
      const city = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(data.city)}&region=de&components=country:DE&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
      const { results } = await city.json();
      const home_city = {
        city: data.city,
        geo: {
          lat: results[0].geometry.location ? results[0].geometry.location.lat : null,
          lng: results[0].geometry.location ? results[0].geometry.location.lng : null
        }
      }
      delete data.city;
      const newData = { ...data, home_city }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
        credentials: "include",
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, options);
      const { error: errorMsg } = await res.json();
      if (errorMsg) {
        setError('E-Mail ist bereits im System hinterlegt.');
        setLoading(false);
        return setTimeout(() => setError(''), 5000);
      } 
      setEndRegister(true);
    } catch (error) {
      setError(error)
      setTimeout(() => setError(null), 5000);
    }
    reset();
    setLoading(false);
  };

  // Autocomplete list and functionality 
  // The active selection's index
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  // The suggestions that match the user's input
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  // Whether or not the suggestion list is shown
  const [showSuggestions, setShowSuggestions] = useState(false);
  // What the user has entered
  const [userInput, setUserInput] = useState('');

  const valueChanged = value => {
    // Filter our suggestions that don't contain the user's input + slice array to show only 5 cit
    const newFilteredArr = citiesArray.filter(suggestion => suggestion.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 5);
    setActiveSuggestion(0);
    setFilteredSuggestions(newFilteredArr)
    setShowSuggestions(true);
  };

  const onClick = e => {
    setActiveSuggestion(0);
    setFilteredSuggestions([])
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText)
  };

  const onKeyDown = e => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion])
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) return;
      setActiveSuggestion(activeSuggestion - 1);
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) return;
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/header-login-dark.svg" : "./assets/header-login-light.svg"}`} />
      </IonHeader>
      <IonContent>
        {!endRegister ? (
        <div className="container mt-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem lines="none" className="mb-1">
              <IonLabel position='stacked' htmlFor="name">Name</IonLabel>
              <Controller 
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <IonInput type="text" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                  )}
                  name="name"
                  rules={{ required: true }}
                  />
            </IonItem>
            {showError("name", errors)}

            <IonItem lines="none" className="mb-1">
              <IonLabel position='stacked' htmlFor="email">E-Mail</IonLabel>
              <Controller 
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <IonInput type="email" inputmode="email" value={value} onIonChange={e => onChange(e.detail.value)} />
                  )}
                  name="email"
                  rules={{ required: true }}
                  />
            </IonItem>
            {showError("email", errors)}

            <IonItem lines="none" className="mb-1">
              <IonLabel position='stacked' htmlFor="password">Passwort</IonLabel>
              <Controller 
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <IonInput type="password" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                  )}
                  name="password"
                  rules={{ 
                    required: true,
                    pattern: {
                      value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                      message: "Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen"
                    } 
                  }}
                  />
            </IonItem>
            {showError("password", errors)}

            <IonItem lines="none" className="mb-1">
              <IonLabel position='stacked' htmlFor="repeatPassword">Passwort wiederholen</IonLabel>
              <Controller 
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <IonInput type="password" id="repeatPassword" inputmode="text" value={value} onIonChange={e => onChange(e.detail.value)} />
                  )}
                  name="repeatPassword"
                  rules={{ 
                    required: true,
                    pattern: {
                      value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/,
                      message: "Bitte überprüfe, ob die unteren Hinweise auf dein Passwort zutreffen"
                    } 
                  }}
                  />
            </IonItem>
            {showError("repeatPassword", errors)}
            {error && <div className='alertMsg'>{error}</div>}

            <IonItem lines="none" className="mb-1">
              <IonLabel position='stacked' htmlFor="city">Stadt <span className="span-small">(für Startpunkt der Karte)</span></IonLabel>
              <Controller 
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <>
                    <IonInput 
                      type="text" 
                      inputmode="text" 
                      value={value = userInput}
                      onKeyDown={e => onKeyDown(e)}
                      onIonChange={e => {
                        onChange(e.detail.value);
                        valueChanged(e.detail.value);
                        setUserInput(e.detail.value);
                      }}
                    />
                    {showSuggestions && userInput && (
                      <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, i) => {
                          return (
                            <li className={i === activeSuggestion ? 'suggestion-active' : ''} key={i} onClick={onClick}>
                              {suggestion}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                )}
                name="city"
                rules={{ required: true }}
              />
            </IonItem>

            <IonButton className="my-3 confirm-btn" type="submit" fill="solid" expand="block">
              <IonIcon className="pe-1" icon={logIn}/>Registrieren
            </IonButton>
          </form>

          <p className="text-center itemTextSmall ion-text-wrap">Nach der Registrierung kannst du neue Eisläden eintragen, bewerten und zu deinen Favoriten hinzufügen.</p>

          <IonCard>
            <IonItem lines="full">
              <IonLabel className="text-center ion-text-wrap" color="primary">Hinweise zur Wahl des Passworts</IonLabel>
            </IonItem>
            <div className="text-center px-4 my-2">
              <div className="itemTextSmall">mindestens eine Ziffer [0-9]</div>
              <div className="itemTextSmall">mindestens einen kleinen Buchstaben [a-z]</div>
              <div className="itemTextSmall">mindestens einen großen Buchstaben [A-Z]</div>
              <div className="itemTextSmall">mindestens 6 Stellen lang, maximal 32</div>
              <div className="itemTextSmallWarning mt-3 ion-text-wrap">Dein Passwort wird verschlüsselt in der Datenbank gespeichert und ist für niemanden einzusehen</div>
            </div>
          </IonCard>
          <IonCard>
            <p className="text-center itemTextSmall ion-text-wrap px-4 my-2 ">
              Die Datenschutzhinweise, denen du mit der Registrierung zustimmst, findest du hier
            </p>
            <p className="text-center">
              <IonButton className="add-control" button routerLink='/datenschutz' lines="none">
                <IonLabel>Datenschutz</IonLabel>
                <IonIcon slot="end" icon={lockClosed} />
              </IonButton>
            </p>
          </IonCard>
        </div>
        ) : (
          <div className="container text-center">
            <IonCard>
              <IonCardContent>
              <IonCardTitle className="mb-3">Registrierung erfolgreich</IonCardTitle>
                Du hast eine Mail erhalten. Klicke auf den Bestätigungs-Link. Kontrolliere auch den Spam-Ordner.
                <IonButton className="my-3 check-btn" routerLink="/home" fill="solid" color="primary" expand="block">
                  Zurück zur Startseite
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        )}

        <LoadingError />
      
      </IonContent>
    </IonPage>
  );
};

export default Register;
import { useState } from 'react';
import { IonInput, IonItem, IonLabel } from '@ionic/react';
import { citiesArray } from './arrayCitiesGermany';

const Autocomplete = () => {
  // The active selection's index
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  // The suggestions that match the user's input
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  // Whether or not the suggestion list is shown
  const [showSuggestions, setShowSuggestions] = useState(false);
  // What the user has entered
  const [userInput, setUserInput] = useState('');

  const onChange = (value) => {
    // Filter our suggestions that don't contain the user's input
    const newFilteredArr = citiesArray.filter(
      (suggestion) => suggestion.toLowerCase().indexOf(value.toLowerCase()) > -1
    );

    setActiveSuggestion(0);
    setFilteredSuggestions(newFilteredArr);
    setShowSuggestions(true);
  };

  const onClick = (e) => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText);
  };

  const onKeyDown = (e) => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion]);
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
    <IonItem lines='none' className='mb-1'>
      <IonLabel position='floating' htmlFor='city'>
        Stadt <span className='span-small'>(für Startpunkt der Karte)</span>
      </IonLabel>
      <IonInput
        type='text'
        inputmode='text'
        value={userInput}
        onKeyDown={(e) => onKeyDown(e)}
        onIonChange={(e) => {
          onChange(e.detail.value);
          setUserInput(e.detail.value);
        }}
      />
      {showSuggestions && userInput ? (
        <ul className='suggestions'>
          {filteredSuggestions.map((suggestion, i) => {
            return (
              <li
                className={i === activeSuggestion ? 'suggestion-active' : ''}
                key={i}
                onClick={onClick}
              >
                {suggestion}
              </li>
            );
          })}
        </ul>
      ) : userInput.length > 0 ? (
        <div className='no-suggestions'>Ups, eine noch unbekannte Stadt</div>
      ) : null}
    </IonItem>
  );
};

export default Autocomplete;

import React, { useState, useEffect, createContext } from "react";
import { mapDark, mapLight } from '../components/mapStyles'

export const Context = createContext();

const AppState = ({children}) => {
  const [toggle, setToggle] = useState(true);
  const [mapStyles, setMapStyles] = useState(mapDark);

  const handleToggleDN = (e) => {
    setToggle((prev) => !prev);
    if(!toggle) {
      document.body.setAttribute('color-theme', 'dark');
      setMapStyles(mapDark);
    } else {
      document.body.setAttribute('color-theme', 'light');
      setMapStyles(mapLight);
    }
  };

  return (
    <Context.Provider
      value={{
        toggle,
        handleToggleDN,
        mapStyles
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppState;
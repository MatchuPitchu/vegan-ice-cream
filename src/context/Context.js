import React, { useState, useEffect, createContext } from "react";
import { mapDark, mapLight } from '../components/mapStyles'

export const Context = createContext();

const AppState = ({children}) => {
  const [toggle, setToggle] = useState(true);
  const [mapState, setMapState] = useState(mapDark);

  const handleToggleDN = (e) => {
    setToggle((prev) => !prev);
    if(!toggle) {
      document.body.setAttribute('color-theme', 'dark');
      setMapState(mapDark);
    } else {
      document.body.setAttribute('color-theme', 'light');
      setMapState(mapLight);
    }
  };

  return (
    <Context.Provider
      value={{
        toggle,
        handleToggleDN,
        mapState
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppState;
import React, { useState, useEffect, createContext } from "react";

export const Context = createContext();

const AppState = ({children}) => {
  const [toggle, setToggle] = useState(false);

  const handleToggleDN = (e) => {
    setToggle((prev) => !prev);
    if(!toggle) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  };

  return (
    <Context.Provider
      value={{
        toggle,
        handleToggleDN,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppState;
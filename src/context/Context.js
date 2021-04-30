import React, { useState, useEffect, createContext } from "react";
import { mapDark, mapLight } from '../components/mapStyles'
import { createAnimation } from '@ionic/react';

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

  // animations modal
  const enterAnimation = (modal) => {
    // darkened background 
    const backdropAnimation = createAnimation()
      .addElement(modal.querySelector('ion-backdrop'))
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    // animates modal
    const wrapperAnimation = createAnimation()
      .addElement(modal.querySelector('.modal-wrapper'))
      .keyframes([
        { offset: 0, opacity: '1', transform: 'translateY(300px)' },
        { offset: 1, opacity: '1', transform: 'translateY(0)' },
      ]);

    return createAnimation()
      .addElement(modal)
      .easing('ease-out')
      .duration(200)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }

  const leaveAnimation = (modal) => {
    return enterAnimation(modal).direction('reverse');
  }

  return (
    <Context.Provider
      value={{
        toggle,
        handleToggleDN,
        mapStyles,
        enterAnimation,
        leaveAnimation
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppState;
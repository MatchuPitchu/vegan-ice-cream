import { useState, useEffect, createContext } from "react";
import { mapDark, mapLight } from '../components/mapStyles'
import { createAnimation } from '@ionic/react';

export const Context = createContext();

const AppState = ({children}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState();
  const [error, setError] = useState('');
  const [toggle, setToggle] = useState(true);
  const [mapStyles, setMapStyles] = useState(mapDark);
  const [showModal, setShowModal] = useState(false);

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
  const enterAnimationBtm = (modal) => {
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

  const leaveAnimationBtm = (modal) => {
    return enterAnimationBtm(modal).direction('reverse');
  }

  const enterAnimationLft = (modal) => {
    // darkened background 
    const backdropAnimation = createAnimation()
      .addElement(modal.querySelector('ion-backdrop'))
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    // animates modal
    const wrapperAnimation = createAnimation()
      .addElement(modal.querySelector('.modal-wrapper'))
      .keyframes([
        { offset: 0, opacity: '1', transform: 'translateX(-300px)' },
        { offset: 1, opacity: '1', transform: 'translateX(0)' },
      ]);

    return createAnimation()
      .addElement(modal)
      .easing('ease-out')
      .duration(200)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }

  const leaveAnimationLft = (modal) => {
    return enterAnimationLft(modal).direction('reverse');
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuth(true);
  }, []);

  return (
    <Context.Provider
      value={{
        isAuth,
        setIsAuth,
        user,
        setUser,
        error,
        setError,
        toggle,
        handleToggleDN,
        mapStyles,
        enterAnimationBtm,
        leaveAnimationBtm,
        enterAnimationLft,
        leaveAnimationLft,
        showModal,
        setShowModal
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppState;
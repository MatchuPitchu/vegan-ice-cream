import { useState, useEffect, createContext } from "react";
import { mapDark, mapLight } from '../components/mapStyles'
import { createAnimation } from '@ionic/react';

export const Context = createContext();

const AppState = ({children}) => {
  const [token, setToken] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState();
  const [error, setError] = useState('');
  const [toggle, setToggle] = useState(true);
  const [mapStyles, setMapStyles] = useState(mapDark);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // This should also return the user info in order to store it in the user context
    const verifySession = async () => {
    const options = {
        headers: { token },
        credentials: "include"
      };  
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify-session`, options);
      const { success, user } = await res.json();
      if (success) {
        setIsAuth(true);
        setUser(user);
      } else {
        localStorage.removeItem('token');
        setIsAuth("false");
        setUser({});
      }
    };
    if (token) {
      verifySession();
    }
  }, []);

  useEffect( async() => {
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: { "token": token },
        credentials: "include"
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/infos`, options);
      const data = await res.json();
      console.log(data);
      setUser({...user});
    } catch (error) {
      console.log(error);
    }
  }, [user._id])

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
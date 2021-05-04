import { useState, useEffect, createContext } from "react";
import { mapDark, mapLight } from '../components/mapStyles'
import { createAnimation } from '@ionic/react';

export const Context = createContext();

const AppState = ({children}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [locations, setLocations] = useState([]);
  const [locPage, setLocPage] = useState(1);
  const [disableInfScroll, setDisableInfScroll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toggle, setToggle] = useState(true);
  const [mapStyles, setMapStyles] = useState(mapDark);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    // First check if token is valid, then fetch all user infos and set to state
    const verifySession = async () => {
      const options = {
        headers: { token },
        credentials: "include"
      };  
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify-session`, options);
      const { success, user } = await res.json();
      if (success) {
        setIsAuth(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/infos`, options);
        const data = await res.json();
        console.log(data);
        setUser({ ...user, ...data});
      };
    }
    if (token) {
      verifySession();
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchLoc = async () => {
      try {
        const limit = 4;
        const res = await fetch(`${process.env.REACT_APP_API_URL}/locations?page=${locPage}&limit=${limit}`) 
        const data = await res.json();
        if(data && data.length === limit) {
          setLocations([...locations, ...data]);
        } else {
          setDisableInfScroll(true);
        }
        console.log(data);
      } catch (err) {
        console.log(err.message)
      }
    }
    fetchLoc();
  }, [locPage])

  const loadMore = (e) => {
    setLocPage(prev => prev + 1);
    e.target.complete();
  }

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
        locations,
        setLocations,
        locPage, 
        setLocPage,
        disableInfScroll, 
        setDisableInfScroll,
        loadMore,
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
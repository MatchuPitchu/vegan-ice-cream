import { useState, useEffect, createContext } from "react";
import { mapDark, mapLight } from '../components/mapStyles'
import { createAnimation } from '@ionic/react';

export const Context = createContext();

const AppState = ({children}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [locations, setLocations] = useState([]);
  const [locPage, setLocPage] = useState(1);
  const [all, setAll] = useState(false);
  const [disableInfScroll, setDisableInfScroll] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [map, setMap]= useState(null);
  const [selected, setSelected] = useState(null);
  const [position, setPosition] = useState();
  const [newLocation, setNewLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toggle, setToggle] = useState(true);
  const [mapStyles, setMapStyles] = useState(mapDark);
  const [showProfil, setShowProfil] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showNewLocModal, setShowNewLocModal] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [alertUpdateFav, setAlertUpdateFav] = useState({
    removeStatus: false, 
    addStatus: false, 
    location: {}
  });

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    // First check if token is valid, then fetch all user infos and set to state
    try {
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
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchLoc = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/locations`)
        const data = await res.json();
        setLocations(data);
      } catch (error) {
        setError(error.message);
      }
    }
    if(all) fetchLoc();
  }, [all])

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
      } catch (error) {
        setError(error.message);
      }
    }
    if(!all) fetchLoc();
  }, [locPage])

  const loadMore = (e) => {
    setLocPage(prev => prev + 1);
    e.target.complete();
  }
  
  const addFavLoc = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token
        },
        // converts JS data into JSON string.
        body: JSON.stringify({add_location_id: alertUpdateFav.location._id}),
        credentials: "include",
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/add-fav-loc`, options);
      // Don't need sended back data of server
      // const favorite_locations = await res.json();
      const newFavLoc = [...user.favorite_locations, alertUpdateFav.location]
      console.log(newFavLoc)
      setUser(prev => ({ ...prev, favorite_locations: newFavLoc }));
      setAlertUpdateFav({...alertUpdateFav, addStatus: false, location: null});
    } catch (error) {
      console.log(error.message);
      setError('Da ist etwas schief gelaufen. Versuche es später nochmal.')
      setTimeout(() => setError(null), 5000);
    };
    setLoading(false)
  };

  const removeFavLoc = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token
        },
        // converts JS data into JSON string.
        body: JSON.stringify({remove_location_id: alertUpdateFav.location._id}),
        credentials: "include",
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/remove-fav-loc`, options);
      const favorite_locations = await res.json();
      setUser(prev => ({ ...prev, favorite_locations }));
      setAlertUpdateFav({...alertUpdateFav, removeStatus: false, location: null});
    } catch (error) {
      console.log(error.message);
      setError('Da ist etwas schief gelaufen. Versuche es später nochmal.')
      setTimeout(() => setError(null), 5000);
    };
    setLoading(false);
  };

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
        isAuth, setIsAuth,
        user, setUser,
        locations, setLocations,
        locPage, setLocPage,
        all, setAll,
        disableInfScroll, setDisableInfScroll,
        searchText, setSearchText,
        map, setMap,
        selected, setSelected,
        position, setPosition,
        newLocation, setNewLocation,
        loading, setLoading,
        loadMore,
        error, setError,
        toggle,
        handleToggleDN,
        mapStyles,
        enterAnimationBtm, leaveAnimationBtm,
        enterAnimationLft, leaveAnimationLft,
        showProfil, setShowProfil,
        showFeedback, setShowFeedback,
        showAbout, setShowAbout,
        showMapModal, setShowMapModal,
        showNewLocModal, setShowNewLocModal,
        bookmark, setBookmark,
        alertUpdateFav, setAlertUpdateFav,
        removeFavLoc,
        addFavLoc
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppState;
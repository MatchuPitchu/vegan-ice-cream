import { useState, useEffect, createContext } from "react";
import { mapDark, mapLight } from '../components/mapStyles'
import { createAnimation } from '@ionic/react';

export const Context = createContext();

const AppState = ({children}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [numNewLoc, setNumNewLoc] = useState();
  const [locations, setLocations] = useState([]);
  const [locationsMap, setLocationsMap] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [locPage, setLocPage] = useState(1);
  const [num, setNum] = useState(4);
  const [all, setAll] = useState(false);
  const [disableInfScroll, setDisableInfScroll] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [map, setMap]= useState(null);
  const [viewport, setViewport] = useState({});
  const [center, setCenter] = useState({ lat:  52.524, lng: 13.410 });
  const [zoom, setZoom] = useState(12);
  const [selected, setSelected] = useState(null);
  const [searchSelected, setSearchSelected] = useState(null);
  const [position, setPosition] = useState();
  const [newLocation, setNewLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toggle, setToggle] = useState(null);
  const [mapStyles, setMapStyles] = useState(null);
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
  const [ openComments, setOpenComments ] = useState(false);
  const [ newComment, setNewComment ] = useState(null);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');

    // First check if token is valid, then fetch all user infos and set to state
    const verifySession = async () => {
      try {
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
          setUser({ ...user, ...data});
        };
      } catch (error) {
        console.log(error.message);
      }
    }

    if (token) verifySession();   
    setLoading(false);
  }, [newComment]);

  useEffect(() => {
    const updateNewNumLoc = async () => {
      try {
        const token = localStorage.getItem('token');
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token
          },
          // converts JS data into JSON string.
          body: JSON.stringify({current_num_loc: locations.length}),
          credentials: "include"
        };
        await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/num-loc-last-visit`, options);
      } catch (error) {
        setError(error.message);
      }
    }

    if(locations && user) {
      const timer = setTimeout(() => updateNewNumLoc(), 20000);
      setNumNewLoc(locations.length - user.num_loc_last_visit);
      
      return () => clearTimeout(timer);
    }

  }, [locations, user])

  useEffect(() => {
    const fetchLoc = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/locations`)
        const data = await res.json();
        console.log('All locations:', data);
        setLocations(data);

        // set first elements for locations segment 'list' when mounting page
        if(locationsList.length < 4) {
          const newArr = data.slice(0, 4)
          setLocationsList(newArr)
          console.log('newArr', newArr)
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchLoc();
  }, [])


  useEffect(() => {
    const updateLocInViewport = async () => {
      try {
        const limit = 50;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // converts JS data into JSON string.
          body: JSON.stringify({
            southLat: viewport.southLat,
            westLng: viewport.westLng,
            northLat: viewport.northLat,
            eastLng: viewport.eastLng,
          }),
          credentials: "include",
        };
        const res = await fetch(`${process.env.REACT_APP_API_URL}/locations/viewport?limit=${limit}`, options)
        const data = await res.json();
        setLocationsMap(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    if(viewport) updateLocInViewport();
  }, [viewport, searchSelected])

  const searchViewport = () => {
    let { Ua, La } = map.getBounds()
    const latLngBounds = {
      southLat: Ua.g,
      westLng: La.g,
      northLat: Ua.i,
      eastLng: La.i,
    };
    setViewport(latLngBounds);
  }

  useEffect(() => {
    const newArr = locations.slice(num, num+4)
    console.log('newArr', newArr)
    setNum(prev => prev + 4)
    setLocationsList([...locationsList, ...newArr])
    console.log(locationsList);
  }, [locPage])

  
  useEffect(() => {
    const initTheme = () => {
      var darkSelected = (localStorage.getItem('themeSwitch') !== null && localStorage.getItem('themeSwitch') === 'dark');
      if(darkSelected) {
        document.body.setAttribute('color-theme', 'dark') 
        setMapStyles(mapDark);
        setToggle(true);
      } else {
        document.body.setAttribute('color-theme', 'light');
        setMapStyles(mapLight);
        setToggle(false);
      } 
    };
    
    initTheme()
  }, [])

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

  const handleToggleDN = () => {
    setToggle((prev) => !prev);
    if(!toggle) {
      document.body.setAttribute('color-theme', 'dark');
      setMapStyles(mapDark);
      localStorage.setItem('themeSwitch', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
      setMapStyles(mapLight);
      localStorage.removeItem('themeSwitch');
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
        numNewLoc, setNumNewLoc,
        locations, setLocations,
        locationsMap, setLocationsMap,
        locationsList, setLocationsList,
        locPage, setLocPage,
        all, setAll,
        disableInfScroll, setDisableInfScroll,
        searchText, setSearchText,
        map, setMap,
        viewport, setViewport,
        searchViewport,
        center, setCenter,
        zoom, setZoom,
        selected, setSelected,
        searchSelected, setSearchSelected,
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
        addFavLoc,
        openComments, setOpenComments,
        newComment, setNewComment
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppState;
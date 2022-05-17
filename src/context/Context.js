import { useState, useEffect, createContext } from 'react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { createAnimation } from '@ionic/react';
import { useVerifySessionQuery } from '../store/auth-api-slice';
import { useGetAdditionalInfosFromUserQuery } from '../store/user-api-slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userActions } from '../store/userSlice';
import { mapActions } from '../store/mapSlice';
import { selectedLocationActions } from '../store/selectedLocationSlice';

export const Context = createContext();

const AppStateProvider = ({ children }) => {
  // OLD CONTEXT
  // const [isAuth, setIsAuth] = useState(false);
  // const [user, setUser] = useState(null);
  // const [searchFlavor, setSearchFlavor] = useState('');
  // const [flavor, setFlavor] = useState({});
  // const [showUpdateComment, setShowUpdateComment] = useState({
  //   state: false,
  //   comment_id: '',
  // });
  // const [showProfil, setShowProfil] = useState(false);
  // const [showUpdateProfil, setShowUpdateProfil] = useState(false);
  // const [showFeedback, setShowFeedback] = useState(false);
  // const [showAbout, setShowAbout] = useState(false);
  // const [selected, setSelected] = useState(null);
  const [activateMessage, setActivateMessage] = useState('Waiting');
  const [successMsg, setSuccessMsg] = useState('');
  const [numNewLoc, setNumNewLoc] = useState();
  const [locations, setLocations] = useState([]);
  const [locationsMap, setLocationsMap] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [listResults, setListResults] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [autocompleteModal, setAutocompleteModal] = useState(false);
  const [searchAutocomplete, setSearchAutocomplete] = useState('');
  const [result, setResult] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState(null);
  const [openComments, setOpenComments] = useState(false);
  const [locPage, setLocPage] = useState(1);
  const [num, setNum] = useState(4);
  const [all, setAll] = useState(false);
  const [disableInfScroll, setDisableInfScroll] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityName, setCityName] = useState('');
  const [noTopLoc, setNoTopLoc] = useState(false);
  const [showTopLoc, setShowTopLoc] = useState(false);
  const [segment, setSegment] = useState('map');
  const [map, setMap] = useState(null);
  const [searchSelected, setSearchSelected] = useState(null);
  const [position, setPosition] = useState();
  const [newLocation, setNewLocation] = useState(null);
  const [checkMsgNewLoc, setCheckMsgNewLoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoModal, setInfoModal] = useState(false);
  const [newLocModal, setNewLocModal] = useState(false);
  const [alertUpdateFav, setAlertUpdateFav] = useState({
    removeStatus: false,
    addStatus: false,
    location: {},
  });
  const [newComment, setNewComment] = useState(null);

  // START REDUX TOOLKIT UPDATE
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { viewport } = useAppSelector((state) => state.map);
  const { selectedLocation } = useAppSelector((state) => state.selectedLocation);

  // console.log(viewport);
  // How to use the hook: https://redux-toolkit.js.org/tutorials/rtk-query#create-an-api-service
  // const {
  //   data,
  //   error: errorRTKQuery,
  //   isFetching,
  //   isLoading,
  //   isSuccess,
  //   isError,
  // } = useVerifySessionQuery();

  // const {
  //   data,
  //   error: errorRTKQuery,
  //   isFetching,
  //   isLoading,
  //   isSuccess,
  //   isError,
  // } = useGetAdditionalInfosFromUserQuery(user?._id ?? skipToken); // when `id` is nullish (null/undefined), query is skipped: https://redux-toolkit.js.org/rtk-query/usage-with-typescript#skipping-queries-with-typescript-using-skiptoken

  // console.log(data, isLoading);

  // END REDUX TOOLKIT

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');

    // First check if token is valid, then fetch all user infos and set to state
    const verifySession = async () => {
      try {
        const options = {
          headers: { token },
          credentials: 'include',
        };
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify-session`, options);
        const { success, user } = await res.json();
        if (success) {
          dispatch(userActions.login());
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/users/${user._id}/infos`,
            options
          );
          const data = await res.json();
          dispatch(userActions.updateUser({ ...user, ...data }));
          // setUser({ ...user, ...data });
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    if (token) verifySession();

    setLoading(false);
  }, [newComment, dispatch]);

  useEffect(() => {
    const updateNewNumLoc = async () => {
      try {
        const token = localStorage.getItem('token');
        const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
          // converts JS data into JSON string.
          body: JSON.stringify({ current_num_loc: locations.length }),
          credentials: 'include',
        };
        await fetch(
          `${process.env.REACT_APP_API_URL}/users/${user._id}/num-loc-last-visit`,
          options
        );
      } catch (err) {
        console.log(err.message);
      }
    };

    if (locations && user) {
      const timer = setTimeout(() => updateNewNumLoc(), 25000);
      setNumNewLoc(locations.length - user.num_loc_last_visit);
      return () => clearTimeout(timer);
    }
  }, [locations, user]);

  useEffect(() => {
    const fetchLoc = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/locations`);
        const data = await res.json();
        setLocations(data);

        // set first elements for locations segment 'list' when mounting page
        if (locationsList.length < 4) {
          const newArr = data.slice(0, 4);
          setLocationsList(newArr);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchLoc();
  }, []);

  const fetchUpdatedLoc = async (loc) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/locations/${loc._id}`);
      const updatedLoc = await res.json();
      // filter out updated loc of these two locations arrays, than via spread operator add updatedLoc to arrays
      const newArr1 = locations.filter((loc) => loc._id !== updatedLoc._id);
      setLocations([...newArr1, updatedLoc]);
      const newArr2 = locationsList.filter((loc) => loc._id !== updatedLoc._id);
      setLocationsList([...newArr2, updatedLoc]);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchAllCitiesWithLoc = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/locations/cities-with-locations`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchAllCitiesWithLoc();
  }, []);

  useEffect(() => {
    // if user changes segment ('map' or 'list') than value of searchbar is reseted
    setSearchText('');
  }, [segment]);

  // fetch data of locations in viewport
  useEffect(() => {
    const updateLocInViewport = async () => {
      try {
        const limit = 500;
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // converts JS data into JSON string.
          body: JSON.stringify({
            southLat: viewport.southLat,
            westLng: viewport.westLng,
            northLat: viewport.northLat,
            eastLng: viewport.eastLng,
          }),
          credentials: 'include',
        };
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/locations/viewport?limit=${limit}`,
          options
        );
        const data = await res.json();
        setLocationsMap(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (viewport) updateLocInViewport();
  }, [viewport, searchSelected]);

  const searchViewport = () => {
    let southLat = map.getBounds().getSouthWest().lat();
    let westLng = map.getBounds().getSouthWest().lng();
    let northLat = map.getBounds().getNorthEast().lat();
    let eastLng = map.getBounds().getNorthEast().lng();

    const latLngBounds = {
      southLat,
      westLng,
      northLat,
      eastLng,
    };
    dispatch(mapActions.setViewport(latLngBounds));
  };

  const loadMore = (e) => {
    setLocPage((prev) => prev + 1);
    const newArr = locations.slice(num, num + 4);
    setNum((prev) => prev + 4);
    setLocationsList([...locationsList, ...newArr]);
    e.target.complete();
  };

  // delete comment, update user and selected location data, calculate new rating averages to display them immediately
  const deleteComment = async (comment) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        // converts JS data into JSON string.
        body: JSON.stringify({ user_id: user._id }),
        credentials: 'include',
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${comment._id}`, options);
      if (res.status === 200) {
        if (selectedLocation) {
          // remove deleted comment from selected comments list array
          const newList = selectedLocation.comments_list.filter((item) => item._id !== comment._id);

          // if list exists after removing than calc new avg ratings without fetching data from API - rounded to one decimal
          if (newList.length) {
            // if length list = 1 than take directly rating
            const sumQuality =
              newList.length === 1
                ? newList[0].rating_quality
                : newList.reduce((a, b) => a.rating_quality + b.rating_quality);
            const sumVegan =
              newList.length === 1
                ? newList[0].rating_vegan_offer
                : newList.reduce((a, b) => a.rating_vegan_offer + b.rating_vegan_offer);
            const location_rating_quality =
              Math.round((sumQuality / newList.length) * 10) / 10 || 0;
            const location_rating_vegan_offer =
              Math.round((sumVegan / newList.length) * 10) / 10 || 0;

            dispatch(
              selectedLocationActions.updateSelectedLocation({
                comments_list: newList,
                location_rating_quality,
                location_rating_vegan_offer,
              })
            );
          } else {
            dispatch(
              selectedLocationActions.updateSelectedLocation({
                comments_list: [],
              })
            );
          }
        }

        // remove deleted comment from user profil comments list array
        const newUserList = user.comments_list.filter((item) => item._id !== comment._id);
        dispatch(userActions.updateUser({ comments_list: newUserList }));
        // setUser({ ...user, comments_list: newUserList });
      }
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  const addFavLoc = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        // converts JS data into JSON string.
        body: JSON.stringify({ add_location_id: alertUpdateFav.location._id }),
        credentials: 'include',
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user._id}/add-fav-loc`,
        options
      );
      // Don't need sended back data of server
      // const favorite_locations = await res.json();
      const newFavLoc = [...user.favorite_locations, alertUpdateFav.location];
      dispatch(userActions.updateUser({ favorite_locations: newFavLoc }));
      // setUser((prev) => ({ ...prev, favorite_locations: newFavLoc }));
      setAlertUpdateFav({
        ...alertUpdateFav,
        addStatus: false,
        location: null,
      });
    } catch (err) {
      console.log(err.message);
      setError('Da ist etwas schief gelaufen. Versuche es später nochmal');
      setTimeout(() => setError(null), 5000);
    }
    setLoading(false);
  };

  const removeFavLoc = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        // converts JS data into JSON string.
        body: JSON.stringify({
          remove_location_id: alertUpdateFav.location._id,
        }),
        credentials: 'include',
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user._id}/remove-fav-loc`,
        options
      );
      const favorite_locations = await res.json();
      dispatch(userActions.updateUser({ favorite_locations }));
      // setUser((prev) => ({ ...prev, favorite_locations }));
      setAlertUpdateFav({
        ...alertUpdateFav,
        removeStatus: false,
        location: null,
      });
    } catch (err) {
      console.log(err.message);
      setError('Da ist etwas schief gelaufen. Versuche es später nochmal');
      setTimeout(() => setError(null), 5000);
    }
    setLoading(false);
  };

  const createPricing = async (data) => {
    const token = localStorage.getItem('token');
    try {
      const body = {
        pricing: data.pricing,
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/locations/pricing/${searchSelected._id}`,
        options
      );
      const updatedLoc = await res.json();
      const newArr1 = locations.filter((loc) => loc._id !== updatedLoc._id);
      setLocations([...newArr1, updatedLoc]);
      const newArr2 = locationsList.filter((loc) => loc._id !== updatedLoc._id);
      setLocationsList([...newArr2, updatedLoc]);
    } catch (err) {
      console.log(err.message);
      setError('Da ist etwas schief gelaufen. Versuche es später nochmal');
      setTimeout(() => setError(null), 5000);
    }
  };

  // ToDo: Create custom Hook for animation logic

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
  };

  const leaveAnimationBtm = (modal) => {
    return enterAnimationBtm(modal).direction('reverse');
  };

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
  };

  const leaveAnimationLft = (modal) => {
    return enterAnimationLft(modal).direction('reverse');
  };

  return (
    <Context.Provider
      value={{
        activateMessage,
        setActivateMessage,
        successMsg,
        setSuccessMsg,
        numNewLoc,
        setNumNewLoc,
        locations,
        setLocations,
        locationsMap,
        setLocationsMap,
        locationsList,
        setLocationsList,
        topLocations,
        setTopLocations,
        fetchUpdatedLoc,
        cities,
        setCities,
        listResults,
        setListResults,
        autocomplete,
        setAutocomplete,
        autocompleteModal,
        setAutocompleteModal,
        searchAutocomplete,
        setSearchAutocomplete,
        result,
        setResult,
        formattedAddress,
        setFormattedAddress,
        locPage,
        setLocPage,
        all,
        setAll,
        disableInfScroll,
        setDisableInfScroll,
        searchText,
        setSearchText,
        cityName,
        setCityName,
        noTopLoc,
        setNoTopLoc,
        showTopLoc,
        setShowTopLoc,
        segment,
        setSegment,
        map,
        setMap,
        searchViewport,
        searchSelected,
        setSearchSelected,
        position,
        setPosition,
        newLocation,
        setNewLocation,
        checkMsgNewLoc,
        setCheckMsgNewLoc,
        loading,
        setLoading,
        loadMore,
        error,
        setError,
        enterAnimationBtm,
        leaveAnimationBtm,
        enterAnimationLft,
        leaveAnimationLft,
        infoModal,
        setInfoModal,
        newLocModal,
        setNewLocModal,
        alertUpdateFav,
        setAlertUpdateFav,
        deleteComment,
        addFavLoc,
        removeFavLoc,
        createPricing,
        openComments,
        setOpenComments,
        newComment,
        setNewComment,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppStateProvider;

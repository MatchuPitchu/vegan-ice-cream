import { useState, useEffect, createContext } from 'react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useVerifySessionQuery } from '../store/auth-api-slice';
import { useGetAdditionalInfosFromUserQuery } from '../store/user-api-slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userActions } from '../store/userSlice';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { locationsActions } from '../store/locationsSlice';

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
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');
  // const [successMsg, setSuccessMsg] = useState('');
  // const [checkMsgNewLocation, setCheckMsgNewLoc] = useState('');
  // const [alertUpdateFav, setAlertUpdateFav] = useState({
  //   removeStatus: false,
  //   addStatus: false,
  //   location: {},
  // });
  // const [locationsList, setLocationsList] = useState([]);
  // const [locations, setLocations] = useState([]);
  // const [locationsMap, setLocationsMap] = useState([]);
  // const [newLocation, setNewLocation] = useState(null);

  const [numNewLoc, setNumNewLoc] = useState();
  const [topLocations, setTopLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [listResults, setListResults] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [autocompleteModal, setAutocompleteModal] = useState(false);
  const [searchAutocomplete, setSearchAutocomplete] = useState('');
  const [formattedAddress, setFormattedAddress] = useState(null);
  const [openComments, setOpenComments] = useState(false);

  const [all, setAll] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityName, setCityName] = useState('');
  const [noTopLoc, setNoTopLoc] = useState(false);
  const [showTopLoc, setShowTopLoc] = useState(false);
  const [segment, setSegment] = useState('map');
  const [map, setMap] = useState(null);
  const [searchSelected, setSearchSelected] = useState(null);
  const [position, setPosition] = useState();
  const [infoModal, setInfoModal] = useState(false);
  const [newLocModal, setNewLocModal] = useState(false);
  const [newComment, setNewComment] = useState(null);

  // START REDUX TOOLKIT UPDATE
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { viewport } = useAppSelector((state) => state.map);
  const { locations } = useAppSelector((state) => state.locations);

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
    dispatch(appActions.setIsLoading(true));
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

    dispatch(appActions.setIsLoading(false));
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
        dispatch(locationsActions.setLocations(data));
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchLoc();
  }, [dispatch]);

  const fetchUpdatedLoc = async (loc) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/locations/${loc._id}`);
      const updatedLoc = await res.json();
      dispatch(locationsActions.updateOneLocation(updatedLoc));
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
        dispatch(locationsActions.setLocationsVisibleOnMap(data));
      } catch (err) {
        console.log(err.message);
      }
    };
    if (viewport) updateLocInViewport();
  }, [viewport, searchSelected, dispatch]);

  const searchViewport = () => {
    const latLngBounds = {
      southLat: map.getBounds().getSouthWest().lat(),
      westLng: map.getBounds().getSouthWest().lng(),
      northLat: map.getBounds().getNorthEast().lat(),
      eastLng: map.getBounds().getNorthEast().lng(),
    };
    dispatch(mapActions.setViewport(latLngBounds));
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
      dispatch(locationsActions.updateOneLocation(updatedLoc));
    } catch (err) {
      dispatch(appActions.setError('Da ist etwas schief gelaufen. Versuche es später nochmal'));
      setTimeout(() => dispatch(appActions.resetError()), 5000);
    }
  };

  return (
    <Context.Provider
      value={{
        numNewLoc,
        setNumNewLoc,
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
        formattedAddress,
        setFormattedAddress,
        all,
        setAll,
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
        infoModal,
        setInfoModal,
        newLocModal,
        setNewLocModal,
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

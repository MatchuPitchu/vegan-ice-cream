import { useState, useEffect, createContext } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { mapActions } from '../store/mapSlice';
import { appActions } from '../store/appSlice';
import { locationsActions } from '../store/locationsSlice';
import { useUpdateNumberOfNewLocationsMutation } from '../store/api/user-api-slice';
import { userActions } from '../store/userSlice';
import {
  useGetLocationsQuery,
  useUpdateLocationsInViewportMutation,
} from '../store/api/locations-api-slice';
import { searchActions } from '../store/searchSlice';

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
  // const [numNewLoc, setNumNewLoc] = useState();
  // const [cities, setCities] = useState([]);
  // const [searchText, setSearchText] = useState('');
  // const [segment, setSegment] = useState('map');

  const [map, setMap] = useState(null);
  const [topLocations, setTopLocations] = useState([]);
  const [listResults, setListResults] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [autocompleteModal, setAutocompleteModal] = useState(false);
  const [searchAutocomplete, setSearchAutocomplete] = useState('');
  const [formattedAddress, setFormattedAddress] = useState(null);
  const [openComments, setOpenComments] = useState(false);

  const [all, setAll] = useState(false);
  const [cityName, setCityName] = useState('');
  const [noTopLoc, setNoTopLoc] = useState(false);
  const [showTopLoc, setShowTopLoc] = useState(false);
  const [searchSelected, setSearchSelected] = useState(null);
  const [position, setPosition] = useState();
  const [infoModal, setInfoModal] = useState(false);
  const [newLocModal, setNewLocModal] = useState(false);
  const [newComment, setNewComment] = useState(null);

  // START REDUX TOOLKIT UPDATE
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { viewport } = useAppSelector((state) => state.map);
  const numberOfLocations = useAppSelector((state) => state.locations.locations.length);

  const [triggerUpdateNumberOfNewLocations, result] = useUpdateNumberOfNewLocationsMutation();
  const [triggerUpdateLocationsInViewport, result2] = useUpdateLocationsInViewportMutation();

  // How to use RTK hooks: https://redux-toolkit.js.org/tutorials/rtk-query#create-an-api-service
  // NOTICE: RTK Query ensures that any component that subscribes to the same query will always use the same data.
  // TODO: überall error messages und loading state catchen und in state speichern für Anzeige Loading Spinner

  // END REDUX TOOLKIT

  useEffect(() => {
    // TODO: noch Abhängigkeit "newComment" in RTK Query integrieren, um Re-Fetch zu initiieren
    // TODO: wie gehe ich mit Loading State aus RTK Query um -> Anzeige in Componenten, wo gefetcht wird
    const verifySession = async () => {
      dispatch(appActions.setIsLoading(true));
      dispatch(appActions.setIsLoading(false));
    };
    verifySession();
  }, [newComment, dispatch]);

  useEffect(() => {
    if (numberOfLocations && user) {
      dispatch(userActions.setNumberOfNewLocations(numberOfLocations - user.num_loc_last_visit));
      const timer = setTimeout(
        () =>
          triggerUpdateNumberOfNewLocations({
            userId: user._id,
            numberOfLocations,
          }),
        25000
      );
      return () => clearTimeout(timer);
    }
  }, [numberOfLocations, user, triggerUpdateNumberOfNewLocations, dispatch]);

  // fetch data of locations in viewport
  useEffect(() => {
    if (viewport) {
      triggerUpdateLocationsInViewport({ limit: 500, viewport });
    }
  }, [viewport, triggerUpdateLocationsInViewport]);

  const searchViewport = () => {
    const latLngBounds = {
      southLat: map.getBounds().getSouthWest().lat(),
      westLng: map.getBounds().getSouthWest().lng(),
      northLat: map.getBounds().getNorthEast().lat(),
      eastLng: map.getBounds().getNorthEast().lng(),
    };
    dispatch(mapActions.setViewport(latLngBounds));
  };

  return (
    <Context.Provider
      value={{
        topLocations,
        setTopLocations,
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
        cityName,
        setCityName,
        noTopLoc,
        setNoTopLoc,
        showTopLoc,
        setShowTopLoc,
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

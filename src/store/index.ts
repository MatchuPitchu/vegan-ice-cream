import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { appSliceReducer } from './appSlice';
import { userSliceReducer } from './userSlice';
import { mapSliceReducer } from './mapSlice';
import { flavorSliceReducer } from './flavorSlice';
import { showSliceReducer } from './showSlice';
import { selectedLocationSliceReducer } from './selectedLocationSlice';
import { commentSliceReducer } from './commentSlice';
import { locationsSliceReducer } from './locationsSlice';
import { authApi } from './api/auth-api-slice';
import { userApi } from './api/user-api-slice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

const reducers = combineReducers({
  app: appSliceReducer,
  user: userSliceReducer,
  map: mapSliceReducer,
  flavor: flavorSliceReducer,
  show: showSliceReducer,
  selectedLocation: selectedLocationSliceReducer,
  comment: commentSliceReducer,
  locations: locationsSliceReducer,
  [authApi.reducerPath]: authApi.reducer, // Add generated reducer as a specific top-level slice
  [userApi.reducerPath]: userApi.reducer,
});

const store = configureStore({
  reducer: reducers,
  // Adding api middleware enables caching, invalidation, polling and other useful features of RTK Query
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(authApi.middleware);
  },
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

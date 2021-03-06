import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { appSliceReducer } from './appSlice';
import { userSliceReducer } from './userSlice';
import { mapSliceReducer } from './mapSlice';
import { flavorSliceReducer } from './flavorSlice';
import { showSliceReducer } from './showSlice';
import { commentSliceReducer } from './commentSlice';
import { locationsSliceReducer } from './locationsSlice';
import { searchSliceReducer } from './searchSlice';
import { authApi } from './api/auth-api-slice';
import { userApi } from './api/user-api-slice';
import { locationsApi } from './api/locations-api-slice';
import { commentApi } from './api/comment-api-slice';
import { flavorApi } from './api/flavor-api-slice';
import { googleApi } from './api/google-api-slice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

const reducers = combineReducers({
  app: appSliceReducer,
  user: userSliceReducer,
  map: mapSliceReducer,
  flavor: flavorSliceReducer,
  show: showSliceReducer,
  comment: commentSliceReducer,
  locations: locationsSliceReducer,
  search: searchSliceReducer,
  [authApi.reducerPath]: authApi.reducer, // Add generated reducer as a specific top-level slice
  [userApi.reducerPath]: userApi.reducer,
  [locationsApi.reducerPath]: locationsApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [flavorApi.reducerPath]: flavorApi.reducer,
  [googleApi.reducerPath]: googleApi.reducer,
});

const store = configureStore({
  reducer: reducers,
  // Adding api middleware enables caching, invalidation, polling and other useful features of RTK Query
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(locationsApi.middleware)
      .concat(commentApi.middleware)
      .concat(flavorApi.middleware)
      .concat(googleApi.middleware);
  },
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

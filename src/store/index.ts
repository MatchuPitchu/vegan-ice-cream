import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authSliceReducer } from './authSlice';
import { authApi } from './auth-api-slice';
import { userApi } from './user-api-slice';

const reducers = combineReducers({
  auth: authSliceReducer,
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

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

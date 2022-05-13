import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authSliceReducer } from './authSlice';

const reducers = combineReducers({
  auth: authSliceReducer,
});

const store = configureStore({
  reducer: reducers,
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

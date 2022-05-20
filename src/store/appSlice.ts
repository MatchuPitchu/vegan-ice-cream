import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '../types';

interface AlertUpdateFavorites {
  removeStatus: boolean;
  addStatus: boolean;
  location: Location | null;
}

interface AppStateSlice {
  isLoading: boolean;
  error: string;
  successMsg: string;
  activateMsg: string;
  checkMsgNewLocation: string;
  alertUpdateFav: AlertUpdateFavorites;
}

const initialAppState: AppStateSlice = {
  isLoading: false,
  error: '',
  successMsg: '',
  activateMsg: 'Waiting',
  checkMsgNewLocation: '',
  alertUpdateFav: { removeStatus: false, addStatus: false, location: null },
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    setIsLoading: (state, { payload }: PayloadAction<AppStateSlice['isLoading']>) => {
      state.isLoading = payload;
    },
    setError: (state, { payload }: PayloadAction<AppStateSlice['error']>) => {
      state.error = payload;
    },
    setSuccessMsg: (state, { payload }: PayloadAction<AppStateSlice['successMsg']>) => {
      state.successMsg = payload;
    },
    setActivateMsg: (state, { payload }: PayloadAction<AppStateSlice['activateMsg']>) => {
      state.activateMsg = payload;
    },
    setCheckMsgNewLocation: (
      state,
      { payload }: PayloadAction<AppStateSlice['checkMsgNewLocation']>
    ) => {
      state.checkMsgNewLocation = payload;
    },
    updateAlertUpdateFav: (state, { payload }: PayloadAction<AppStateSlice['alertUpdateFav']>) => {
      state.alertUpdateFav = { ...state.alertUpdateFav, ...payload };
    },
  },
});

export const appActions = appSlice.actions;
export const appSliceReducer = appSlice.reducer;

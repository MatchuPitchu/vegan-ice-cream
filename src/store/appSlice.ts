import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppStateSlice {
  isLoading: boolean;
  error: string;
  successMsg: string;
  checkMsgNewLocation: string;
}

const initialAppState: AppStateSlice = {
  isLoading: false,
  error: '',
  successMsg: '',
  checkMsgNewLocation: '',
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
    resetError: (state) => {
      state.error = initialAppState.error;
    },
    setSuccessMsg: (state, { payload }: PayloadAction<AppStateSlice['successMsg']>) => {
      state.successMsg = payload;
    },
    setCheckMsgNewLocation: (
      state,
      { payload }: PayloadAction<AppStateSlice['checkMsgNewLocation']>
    ) => {
      state.checkMsgNewLocation = payload;
    },
  },
});

export const appActions = appSlice.actions;
export const appSliceReducer = appSlice.reducer;

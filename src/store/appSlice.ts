import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EntdeckenSegment = 'map' | 'list';

export type ActivateAccount = 'Waiting' | 'Aktivierung des Mail-Accounts erfolgreich';

interface AppStateSlice {
  // TODO: instead of isLoading, error etc. einfach enum nutzen mit Union Types: status: 'isLoading' | 'isError' etc.
  isLoading: boolean;
  error: string;
  successMessage: string;
  activateAccountMessage: ActivateAccount;
  checkMessageNewLocation: string;
  entdeckenSegment: EntdeckenSegment;
}

const initialAppState: AppStateSlice = {
  isLoading: false,
  error: '',
  successMessage: '',
  activateAccountMessage: 'Waiting',
  checkMessageNewLocation: '',
  entdeckenSegment: 'map',
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    },
    resetError: (state) => {
      state.error = initialAppState.error;
    },
    setSuccessMsg: (state, { payload }: PayloadAction<string>) => {
      state.successMessage = payload;
    },
    setActivateAccountMessage: (state, { payload }: PayloadAction<ActivateAccount>) => {
      state.activateAccountMessage = payload;
    },
    setCheckMsgNewLocation: (state, { payload }: PayloadAction<string>) => {
      state.checkMessageNewLocation = payload;
    },
    setEntdeckenSegment: (state, { payload }: PayloadAction<EntdeckenSegment>) => {
      state.entdeckenSegment = payload;
    },
  },
});

export const appActions = appSlice.actions;
export const appSliceReducer = appSlice.reducer;

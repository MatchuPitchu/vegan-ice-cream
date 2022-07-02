import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from './api/auth-api-slice';

export type EntdeckenSegment = 'map' | 'list';

export type ActivateAccount = 'init' | 'pending' | 'Aktivierung des Mail-Accounts erfolgreich';

interface AppStateSlice {
  // TODO: instead of isLoading, error etc. einfach enum nutzen mit Union Types: status: 'isLoading' | 'isError' etc.
  isLoading: boolean;
  error: string;
  successMessage: string;
  activateAccountMessage: ActivateAccount;
  confirmMessageNewLocation: string;
  entdeckenSegment: EntdeckenSegment;
}

const initialAppState: AppStateSlice = {
  isLoading: false,
  error: '',
  successMessage: '',
  activateAccountMessage: 'init',
  confirmMessageNewLocation: '',
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
    setSuccessMessage: (state, { payload }: PayloadAction<string>) => {
      state.successMessage = payload;
    },
    setConfirmMessageNewLocation: (state, { payload }: PayloadAction<string>) => {
      state.confirmMessageNewLocation = payload;
    },
    setEntdeckenSegment: (state, { payload }: PayloadAction<EntdeckenSegment>) => {
      state.entdeckenSegment = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.activateUser.matchPending, (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(authApi.endpoints.activateUser.matchFulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.activateAccountMessage = payload.message;
    });
  },
});

export const appActions = appSlice.actions;
export const appSliceReducer = appSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypeShowEditSection {
  state: boolean;
  comment_id: string;
}

export type EntdeckenSegment = 'map' | 'list';

interface AppStateSlice {
  // TODO: instead of isLoading, error etc. einfach enum nutzen mit Union Types: status: 'isLoading' | 'isError' etc.
  isLoading: boolean;
  error: string;
  successMsg: string;
  checkMsgNewLocation: string;
  entdeckenSegment: EntdeckenSegment;
}

const initialAppState: AppStateSlice = {
  isLoading: false,
  error: '',
  successMsg: '',
  checkMsgNewLocation: '',
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
      state.successMsg = payload;
    },
    setCheckMsgNewLocation: (state, { payload }: PayloadAction<string>) => {
      state.checkMsgNewLocation = payload;
    },
    setEntdeckenSegment: (state, { payload }: PayloadAction<EntdeckenSegment>) => {
      state.entdeckenSegment = payload;
    },
  },
});

export const appActions = appSlice.actions;
export const appSliceReducer = appSlice.reducer;
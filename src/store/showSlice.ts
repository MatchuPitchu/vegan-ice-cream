import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ShowStateSlice {
  showProfil: boolean;
  showUpdateProfil: boolean;
  showFeedback: boolean;
  showAbout: boolean;
  showUpdateComment: {
    state: boolean;
    comment_id: string;
  };
}

const initialAuthState: ShowStateSlice = {
  showProfil: false,
  showUpdateProfil: false,
  showFeedback: false,
  showAbout: false,
  showUpdateComment: {
    state: false,
    comment_id: '',
  },
};

const showSlice = createSlice({
  name: 'show',
  initialState: initialAuthState,
  reducers: {
    setShowProfil: (state, { payload }: PayloadAction<ShowStateSlice['showProfil']>) => {
      state.showProfil = payload;
    },
    toggleShowUpdateProfil: (state) => {
      state.showUpdateProfil = !state.showUpdateProfil;
    },
    setShowUpdateProfil: (
      state,
      { payload }: PayloadAction<ShowStateSlice['showUpdateProfil']>
    ) => {
      state.showUpdateProfil = payload;
    },
    setShowFeedback: (state, { payload }: PayloadAction<ShowStateSlice['showFeedback']>) => {
      state.showFeedback = payload;
    },
    setShowAbout: (state, { payload }: PayloadAction<ShowStateSlice['showAbout']>) => {
      state.showAbout = payload;
    },
    setShowUpdateComment: (
      state,
      { payload }: PayloadAction<ShowStateSlice['showUpdateComment']>
    ) => {
      state.showUpdateComment = payload;
    },
  },
});

export const showActions = showSlice.actions;
export const showSliceReducer = showSlice.reducer;

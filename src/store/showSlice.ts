import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypeShowEditSection {
  state: boolean;
  comment_id: string;
}
interface ShowStateSlice {
  showProfil: boolean;
  showUpdateProfil: boolean;
  showFeedback: boolean;
  showAbout: boolean;
  showEditSectionComment: TypeShowEditSection;
  showAddNewLocationModal: boolean;
  showComments: boolean;
  showLocationInfoModal: boolean;
}

const initialAuthState: ShowStateSlice = {
  showProfil: false,
  showUpdateProfil: false,
  showFeedback: false,
  showAbout: false,
  showEditSectionComment: {
    state: false,
    comment_id: '',
  },
  showAddNewLocationModal: false,
  showComments: false,
  showLocationInfoModal: false,
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
    setShowEditSectionComment: (state, { payload }: PayloadAction<TypeShowEditSection>) => {
      state.showEditSectionComment = payload;
    },
    setShowAddNewLocationModal: (state, { payload }: PayloadAction<boolean>) => {
      state.showAddNewLocationModal = payload;
    },
    toggleShowComments: (state) => {
      state.showComments = state.showComments ? false : true;
    },
    closeCommentsAndLocationInfoModal: (state) => {
      state.showComments = false;
      state.showLocationInfoModal = false;
    },
    setShowLocationInfoModal: (state, { payload }: PayloadAction<boolean>) => {
      state.showLocationInfoModal = payload;
    },
  },
});

export const showActions = showSlice.actions;
export const showSliceReducer = showSlice.reducer;

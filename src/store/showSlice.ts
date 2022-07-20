import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypeShowEditSection {
  state: boolean;
  comment_id: string;
}

interface ShowStateSlice {
  showEditSectionComment: TypeShowEditSection;
  showSearchNewLocationModal: boolean;
  showComments: boolean;
  showLocationInfoModal: boolean;
  showAddNewLocationForm: boolean;
}

const initialAuthState: ShowStateSlice = {
  showEditSectionComment: {
    state: false,
    comment_id: '',
  },
  showSearchNewLocationModal: false,
  showComments: false,
  showLocationInfoModal: false,
  showAddNewLocationForm: false,
};

const showSlice = createSlice({
  name: 'show',
  initialState: initialAuthState,
  reducers: {
    setShowEditSectionComment: (state, { payload }: PayloadAction<TypeShowEditSection>) => {
      state.showEditSectionComment = payload;
    },
    setShowSearchNewLocationModal: (state, { payload }: PayloadAction<boolean>) => {
      state.showSearchNewLocationModal = payload;
    },
    setShowAddNewLocationForm: (state, { payload }: PayloadAction<boolean>) => {
      state.showAddNewLocationForm = payload;
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

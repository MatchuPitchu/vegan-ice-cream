import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchStateSlice {
  searchText: string;
}

const initialSearchState: SearchStateSlice = {
  searchText: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initialSearchState,
  reducers: {
    setSearchText: (state, { payload }: PayloadAction<string>) => {
      state.searchText = payload;
    },
  },
});

export const searchActions = searchSlice.actions;
export const searchSliceReducer = searchSlice.reducer;

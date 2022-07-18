import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchStateSlice {
  searchResultState: 'init' | 'found' | 'no-found';
}

const initialSearchState: SearchStateSlice = {
  searchResultState: 'init',
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initialSearchState,
  reducers: {
    setSearchResultState: (
      state,
      { payload }: PayloadAction<{ searchInput: string; resultsLength: number }>
    ) => {
      if (payload.searchInput && payload.resultsLength > 0) {
        state.searchResultState = 'found';
      }
      if (payload.searchInput && payload.resultsLength === 0) {
        state.searchResultState = 'no-found';
      }
      if (!payload.searchInput) {
        state.searchResultState = 'init';
      }
    },
  },
});

export const searchActions = searchSlice.actions;
export const searchSliceReducer = searchSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flavor } from '../types/types';

interface FlavorStateSlice {
  flavor: Flavor | null;
  searchTextFlavor: string;
}

const initialFlavorState: FlavorStateSlice = {
  flavor: null,
  searchTextFlavor: '',
};

const flavorSlice = createSlice({
  name: 'flavor',
  initialState: initialFlavorState,
  reducers: {
    setFlavor: (state, { payload }: PayloadAction<Flavor>) => {
      state.flavor = payload;
    },
    resetFlavor: (state) => {
      state.flavor = initialFlavorState.flavor;
    },
    setSearchTermFlavor: (state, { payload }: PayloadAction<string>) => {
      state.searchTextFlavor = payload;
    },
  },
});

export const flavorActions = flavorSlice.actions;
export const flavorSliceReducer = flavorSlice.reducer;

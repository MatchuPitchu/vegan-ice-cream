import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flavor } from '../types';

interface FlavorStateSlice {
  flavor: Flavor | null;
  searchTermFlavor: string;
}

const initialFlavorState: FlavorStateSlice = {
  flavor: null,
  searchTermFlavor: '',
};

const flavorSlice = createSlice({
  name: 'flavor',
  initialState: initialFlavorState,
  reducers: {
    setFlavor: (state, { payload }: PayloadAction<FlavorStateSlice['flavor']>) => {
      state.flavor = payload;
    },
    setSearchTermFlavor: (
      state,
      { payload }: PayloadAction<FlavorStateSlice['searchTermFlavor']>
    ) => {
      state.searchTermFlavor = payload;
    },
  },
});

export const flavorActions = flavorSlice.actions;
export const flavorSliceReducer = flavorSlice.reducer;

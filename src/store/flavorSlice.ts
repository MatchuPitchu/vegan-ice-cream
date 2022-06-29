import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Flavor } from '../types/types';
import { flavorApi } from './api/flavor-api-slice';

interface FlavorStateSlice {
  flavors: Flavor[];
  flavor: Flavor | null;
  searchTermFlavor: string;
}

const initialFlavorState: FlavorStateSlice = {
  flavors: [],
  flavor: null,
  searchTermFlavor: '',
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
      state.searchTermFlavor = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(flavorApi.endpoints.getFlavors.matchFulfilled, (state, { payload }) => {
      state.flavors = payload;
    });
  },
});

export const flavorActions = flavorSlice.actions;
export const flavorSliceReducer = flavorSlice.reducer;

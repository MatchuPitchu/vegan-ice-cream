import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Flavor } from '../types/types';
import { flavorApi } from './api/flavor-api-slice';

interface FlavorStateSlice {
  flavors: Flavor[];
  flavor: Flavor | null;
}

const initialFlavorState: FlavorStateSlice = {
  flavors: [],
  flavor: null,
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
  },
  extraReducers: (builder) => {
    builder.addMatcher(flavorApi.endpoints.getFlavors.matchFulfilled, (state, { payload }) => {
      state.flavors = payload;
    });
  },
});

export const flavorActions = flavorSlice.actions;
export const flavorSliceReducer = flavorSlice.reducer;

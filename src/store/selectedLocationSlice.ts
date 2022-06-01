import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IceCreamLocation } from '../types';

interface SelectedLocationStateSlice {
  selectedLocation: IceCreamLocation | null;
}

const initialSelectedLocationState: SelectedLocationStateSlice = {
  selectedLocation: null,
};

const selectedLocationSlice = createSlice({
  name: 'selectedLocation',
  initialState: initialSelectedLocationState,
  reducers: {
    setSelectedLocation: (state, { payload }: PayloadAction<IceCreamLocation>) => {
      state.selectedLocation = payload;
    },
    updateSelectedLocation: (state, { payload }: PayloadAction<IceCreamLocation>) => {
      state.selectedLocation = { ...state.selectedLocation, ...payload };
    },
    resetSelectedLocation: (state) => {
      state.selectedLocation = null;
    },
  },
});

export const selectedLocationActions = selectedLocationSlice.actions;
export const selectedLocationSliceReducer = selectedLocationSlice.reducer;

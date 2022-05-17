import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Location } from '../types';

interface SelectedLocationStateSlice {
  selectedLocation: Location;
}

const initialSelectedLocationState: SelectedLocationStateSlice = {
  selectedLocation: {
    _id: '',
    name: '',
    address: {
      city: '',
      country: '',
      geo: {
        lat: null,
        lng: null,
      },
      number: null,
      street: '',
      zipcode: '',
    },
    comments_list: [],
    flavors_listed: [],
    location_num: null,
    location_rating_quality: null,
    location_rating_vegan_offer: null,
    location_url: '',
    pricing: [],
  },
};

const selectedLocationSlice = createSlice({
  name: 'selectedLocation',
  initialState: initialSelectedLocationState,
  reducers: {
    updateSelectedLocation: (
      state,
      { payload }: PayloadAction<SelectedLocationStateSlice['selectedLocation']>
    ) => {
      state.selectedLocation = { ...state.selectedLocation, ...payload };
    },
    resetSelectedLocation: (state) => {
      state.selectedLocation = initialSelectedLocationState.selectedLocation;
    },
  },
});

export const selectedLocationActions = selectedLocationSlice.actions;
export const selectedLocationSliceReducer = selectedLocationSlice.reducer;

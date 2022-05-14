import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface MapStateSlice {
  map: unknown;
  viewport: {
    southLat: number;
    westLng: number;
    northLat: number;
    eastLng: number;
  };
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

const initialMapState: MapStateSlice = {
  map: {},
  viewport: {
    southLat: null,
    westLng: null,
    northLat: null,
    eastLng: null,
  },
  center: {
    lat: null,
    lng: null,
  },
  zoom: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState: initialMapState,
  reducers: {
    setViewport: (state, { payload }: PayloadAction<MapStateSlice['viewport']>) => {
      state.viewport = payload;
    },
  },
});

export const userActions = mapSlice.actions;
export const userSliceReducer = mapSlice.reducer;

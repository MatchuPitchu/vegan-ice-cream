import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ViewportType {
  southLat: google.maps.LatLng;
  westLng: google.maps.LatLng;
  northLat: google.maps.LatLng;
  eastLng: google.maps.LatLng;
}

// TS and Google Maps: https://developers.google.com/maps/documentation/javascript/using-typescript
interface MapStateSlice {
  center: google.maps.LatLngLiteral | null;
  zoom: number;
  viewport: ViewportType | null;
}

const initialMapState: MapStateSlice = {
  center: null,
  zoom: 12,
  viewport: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState: initialMapState,
  reducers: {
    setCenter: (state, { payload }: PayloadAction<MapStateSlice['center']>) => {
      state.center = payload;
    },
    setZoom: (state, { payload }: PayloadAction<MapStateSlice['zoom']>) => {
      state.zoom = payload;
    },
    zoomIn: (state) => {
      // zoom in until zoom level of 17
      if (state.zoom < 18) {
        state.zoom++;
      } else {
        return;
      }
    },
    incrementZoom: (state) => {
      state.zoom++;
    },
    decreaseZoom: (state) => {
      state.zoom--;
    },
    setViewport: (state, { payload }: PayloadAction<MapStateSlice['viewport']>) => {
      state.viewport = payload;
    },
  },
});

export const mapActions = mapSlice.actions;
export const mapSliceReducer = mapSlice.reducer;

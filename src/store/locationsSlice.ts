import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IceCreamLocation } from '../types';

export enum SortType {
  VEGAN_OFFER = 'vegan_offer',
  QUALITY = 'quality',
  CITY = 'city',
  STORE = 'store',
}

const sortNumbersAsc = (type: SortType) => (a: IceCreamLocation, b: IceCreamLocation) => {
  if (
    type === SortType.VEGAN_OFFER &&
    b.location_rating_vegan_offer &&
    a.location_rating_vegan_offer
  ) {
    return a.location_rating_vegan_offer - b.location_rating_vegan_offer;
  }

  if (type === SortType.QUALITY && b.location_rating_quality && a.location_rating_quality) {
    return a.location_rating_quality - b.location_rating_quality;
  }

  return 0;
};

const sortNumbersDesc = (type: SortType) => (a: IceCreamLocation, b: IceCreamLocation) => {
  if (
    type === SortType.VEGAN_OFFER &&
    b.location_rating_vegan_offer &&
    a.location_rating_vegan_offer
  ) {
    return b.location_rating_vegan_offer - a.location_rating_vegan_offer;
  }

  if (type === SortType.QUALITY && b.location_rating_quality && a.location_rating_quality) {
    return b.location_rating_quality - a.location_rating_quality;
  }

  return 0;
};

const sortAtoZ = (type: SortType) => (a: IceCreamLocation, b: IceCreamLocation) => {
  let nameA, nameB;
  if (type === SortType.CITY) {
    nameA = a.address.city.toUpperCase();
    nameB = b.address.city.toUpperCase();
  }

  if (type === SortType.STORE) {
    nameA = a.name.toUpperCase();
    nameB = b.name.toUpperCase();
  }

  if (!nameA || !nameB) return 0;

  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
};

const sortZtoA = (type: SortType) => (a: IceCreamLocation, b: IceCreamLocation) => {
  let nameA, nameB;
  if (type === SortType.CITY) {
    nameA = a.address.city.toUpperCase();
    nameB = b.address.city.toUpperCase();
  }

  if (type === SortType.STORE) {
    nameA = a.name.toUpperCase();
    nameB = b.name.toUpperCase();
  }

  if (!nameA || !nameB) return 0;

  if (nameA > nameB) return -1;
  if (nameA < nameB) return 1;
  return 0;
};

interface LocationsStateSlice {
  locationsList: IceCreamLocation[];
}

const initialLocationsState: LocationsStateSlice = {
  locationsList: [],
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState: initialLocationsState,
  reducers: {
    addToLocationsList: (
      state,
      { payload }: PayloadAction<LocationsStateSlice['locationsList']>
    ) => {
      state.locationsList = [...state.locationsList, ...payload];
    },
    setLocationsList: (state, { payload }: PayloadAction<LocationsStateSlice['locationsList']>) => {
      state.locationsList = payload;
    },
    sortLocationsListVeganOffer: (state, { payload }: { payload: 'asc' | 'desc' }) => {
      state.locationsList =
        payload === 'asc'
          ? state.locationsList.sort(sortNumbersAsc(SortType.VEGAN_OFFER))
          : state.locationsList.sort(sortNumbersDesc(SortType.VEGAN_OFFER));
    },
    sortLocationsListQuality: (state, { payload }: { payload: 'asc' | 'desc' }) => {
      state.locationsList =
        payload === 'asc'
          ? state.locationsList.sort(sortNumbersAsc(SortType.QUALITY))
          : state.locationsList.sort(sortNumbersDesc(SortType.QUALITY));
    },
    sortLocationsListCity: (state, { payload }: { payload: 'asc' | 'desc' }) => {
      state.locationsList =
        payload === 'asc'
          ? state.locationsList.sort(sortAtoZ(SortType.CITY))
          : state.locationsList.sort(sortZtoA(SortType.CITY));
    },
    sortLocationsListStore: (state, { payload }: { payload: 'asc' | 'desc' }) => {
      state.locationsList =
        payload === 'asc'
          ? state.locationsList.sort(sortAtoZ(SortType.STORE))
          : state.locationsList.sort(sortZtoA(SortType.STORE));
    },
  },
});

export const locationsActions = locationsSlice.actions;
export const locationsSliceReducer = locationsSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IceCreamLocation } from '../types';
import { locationsApi } from './api/locations-api-slice';

export enum SortType {
  VEGAN_OFFER = 'vegan_offer',
  QUALITY = 'quality',
  CITY = 'city',
  STORE = 'store',
}

type SortDirection = 'asc' | 'desc';

interface GeoCoordinates {
  lat: number | null;
  lng: number | null;
}

interface Address {
  street: string;
  number: number | null;
  zipcode: string;
  city: string;
  country: string;
  geo: GeoCoordinates;
}

interface NewLocation {
  name: string;
  address: Address;
  location_url: string;
  place_id: string;
}

interface GoogleGeocodingResult {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleGeocodingResultsConverted {
  street_number?: string;
  route?: string;
  political?: string;
  sublocality?: string;
  sublocality_level_1?: string;
  locality?: string;
  administrative_area_level_3?: string;
  administrative_area_level_1?: string;
  country?: string;
  postal_code?: string;
  place_id?: string;
}

interface NewLocationFetchedData {
  name: string;
  address_components: GoogleGeocodingResult[];
  geo: GeoCoordinates;
  location_url: string;
  place_id: string;
}

export type CityName = string;

interface LocationsStateSlice {
  locations: IceCreamLocation[];
  locationsSearchResultsList: IceCreamLocation[];
  topLocationsInCity: IceCreamLocation[];
  newLocation: NewLocation | null;
  locationsVisibleOnMap: IceCreamLocation[];
  citiesWithLocations: CityName[];
}

const initialLocationsState: LocationsStateSlice = {
  locations: [],
  locationsSearchResultsList: [],
  topLocationsInCity: [],
  newLocation: null,
  locationsVisibleOnMap: [],
  citiesWithLocations: [],
};

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

const locationsSlice = createSlice({
  name: 'locations',
  initialState: initialLocationsState,
  reducers: {
    setLocations: (state, { payload }: PayloadAction<IceCreamLocation[]>) => {
      state.locations = payload;
    },
    addToLocations: (state, { payload }: PayloadAction<IceCreamLocation>) => {
      state.locations = [...state.locations, payload];
    },
    updateOneLocation: (state, { payload }: PayloadAction<IceCreamLocation>) => {
      const updatedLocationIndex = state.locations.findIndex(
        (location) => location._id === payload._id
      );
      state.locations[updatedLocationIndex] = payload;
    },
    sortLocationsVeganOffer: (state, { payload }: { payload: SortDirection }) => {
      state.locations =
        payload === 'asc'
          ? state.locations.sort(sortNumbersAsc(SortType.VEGAN_OFFER))
          : state.locations.sort(sortNumbersDesc(SortType.VEGAN_OFFER));
    },
    sortLocationsQuality: (state, { payload }: { payload: SortDirection }) => {
      state.locations =
        payload === 'asc'
          ? state.locations.sort(sortNumbersAsc(SortType.QUALITY))
          : state.locations.sort(sortNumbersDesc(SortType.QUALITY));
    },
    sortLocationsCity: (state, { payload }: { payload: SortDirection }) => {
      state.locations =
        payload === 'asc'
          ? state.locations.sort(sortAtoZ(SortType.CITY))
          : state.locations.sort(sortZtoA(SortType.CITY));
    },
    sortLocationsStore: (state, { payload }: { payload: SortDirection }) => {
      state.locations =
        payload === 'asc'
          ? state.locations.sort(sortAtoZ(SortType.STORE))
          : state.locations.sort(sortZtoA(SortType.STORE));
    },
    // LOCATIONS IN SEARCH RESULT LIST
    setLocationsSearchResults: (state, { payload }: PayloadAction<IceCreamLocation[]>) => {
      state.locationsSearchResultsList = payload;
    },
    resetLocationsSearchResults: (state) => {
      state.locationsSearchResultsList = initialLocationsState.locationsSearchResultsList;
    },
    // TOP LOCATIONS IN ONE CITY
    setTopLocationsInCity: (state, { payload }: PayloadAction<IceCreamLocation[]>) => {
      state.topLocationsInCity = payload;
    },
    // NEW LOCATION
    resetNewLocation: (state) => {
      state.newLocation = initialLocationsState.newLocation;
    },
    setNewLocation: (
      state,
      {
        payload: { name, address_components, geo, location_url, place_id },
      }: PayloadAction<NewLocationFetchedData>
    ) => {
      let address: GoogleGeocodingResultsConverted = {};
      for (const object of address_components) {
        for (const addressField of object.types) {
          Object.assign(address, { [addressField]: object.long_name });
        }
      }

      state.newLocation = {
        name,
        address: {
          street: address.route || '',
          number: +address.street_number! || null,
          zipcode: address.postal_code || '',
          city: address.locality || '',
          country: address.country || '',
          geo: {
            lat: geo?.lat || null,
            lng: geo?.lng || null,
          },
        },
        location_url,
        place_id,
      };
    },
    setCitiesWithLocations: (state, { payload }: PayloadAction<CityName[]>) => {
      state.citiesWithLocations = payload;
    },
    // LOCATIONS VISIBLE ON MAP: for later user, if there are to many locations in database
    setLocationsVisibleOnMap: (state, { payload }: PayloadAction<IceCreamLocation[]>) => {
      state.locationsVisibleOnMap = payload;
    },
    addToLocationsVisibleOnMap: (state, { payload }: PayloadAction<IceCreamLocation[]>) => {
      state.locationsVisibleOnMap = [...state.locations, ...payload];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(locationsApi.endpoints.getLocations.matchFulfilled, (state, { payload }) => {
      state.locations = payload;
    });
    builder.addMatcher(
      locationsApi.endpoints.updatePricing.matchFulfilled,
      (state, { payload }) => {
        const updatedLocationIndex = state.locations.findIndex(
          (location) => location._id === payload._id
        );
        state.locations[updatedLocationIndex] = payload;
      }
    );
    builder.addMatcher(
      locationsApi.endpoints.updateLocationsInViewport.matchFulfilled,
      (state, { payload }) => {
        state.locationsVisibleOnMap = payload;
      }
    );
    builder.addMatcher(
      locationsApi.endpoints.getAllCitiesWithLocations.matchFulfilled,
      (state, { payload }) => {
        state.citiesWithLocations = payload;
      }
    );
  },
});

export const locationsActions = locationsSlice.actions;
export const locationsSliceReducer = locationsSlice.reducer;

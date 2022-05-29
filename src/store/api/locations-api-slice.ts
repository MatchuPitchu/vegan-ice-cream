import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IceCreamLocation } from '../../types';
import { ViewportType } from '../mapSlice';

type CityName = string;

// Define a service using a base URL and expected endpoints
export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  // built-in fetch wrapper
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/locations`,
  }),
  tagTypes: ['Location'], // define tag(s) which can trigger an action
  endpoints: (builder) => {
    return {
      getLocations: builder.query<IceCreamLocation[], void>({
        query: () => ({
          url: `/`,
          method: 'GET',
        }),
      }),
      getOneLocation: builder.query<IceCreamLocation, string>({
        query: (locationId) => ({
          url: `/${locationId}`,
          method: 'GET',
        }),
      }),
      getAllCitiesWithLocations: builder.query<CityName[], void>({
        query: () => ({
          url: `/cities-with-locations`,
          method: 'GET',
        }),
      }),
      updateLocationsInViewport: builder.mutation<
        IceCreamLocation[],
        { limit: number; viewport: ViewportType }
      >({
        query: ({ limit, viewport }) => ({
          url: `/viewport?limit=${limit}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            southLat: viewport.southLat,
            westLng: viewport.westLng,
            northLat: viewport.northLat,
            eastLng: viewport.eastLng,
          },
          credentials: 'include',
        }),
      }),
      postPricing: builder.mutation<IceCreamLocation, { locationId: string; pricing: number }>({
        query: ({ locationId, pricing }) => {
          return {
            url: `/pricing/${locationId}`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: localStorage.getItem('token') ?? '',
            },
            body: {
              pricing,
            },
            credentials: 'include',
          };
        },
      }),
    };
  },
});

export const {
  useGetLocationsQuery,
  useGetOneLocationQuery,
  useGetAllCitiesWithLocationsQuery,
  usePostPricingMutation,
} = locationsApi; // automatically generated query hook

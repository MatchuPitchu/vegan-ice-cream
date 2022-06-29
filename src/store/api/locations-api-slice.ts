import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Comment, Flavor, IceCreamLocation } from '../../types/types';
import type { CityName } from '../locationsSlice';

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
          url: '/',
          method: 'GET',
        }),
      }),
      getOneLocation: builder.query<IceCreamLocation, string>({
        query: (location_id) => ({
          url: `/${location_id}`,
          method: 'GET',
        }),
      }),
      getCommentsAndFlavorsOfSelectedLocation: builder.query<
        { comments_list: Comment[]; flavors_listed: Flavor[] },
        string
      >({
        query: (location_id) => ({
          url: `/${location_id}/all-comments-flavors`,
          method: 'GET',
        }),
      }),
      getAllCitiesWithLocations: builder.query<CityName[], void>({
        query: () => ({
          url: '/cities-with-locations',
          method: 'GET',
        }),
      }),
      addLocation: builder.mutation<
        IceCreamLocation,
        Pick<IceCreamLocation, 'name' | 'address' | 'location_url'>
      >({
        query: (data) => ({
          url: '/',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token') ?? '',
          },
          body: data,
          credentials: 'include',
        }),
      }),
      updatePricing: builder.mutation<IceCreamLocation, { location_id: string; pricing: number }>({
        query: ({ location_id, pricing }) => {
          return {
            url: `/pricing/${location_id}`,
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
  useGetCommentsAndFlavorsOfSelectedLocationQuery,
  useGetAllCitiesWithLocationsQuery,
  useAddLocationMutation,
  useUpdatePricingMutation,
} = locationsApi; // automatically generated query hook

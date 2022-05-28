import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IceCreamLocation } from '../../types';

// Define a service using a base URL and expected endpoints
export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  // built-in fetch wrapper
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ['Location'], // define tag(s) which can trigger an action
  endpoints: (builder) => {
    return {
      getLocations: builder.query<IceCreamLocation[], void>({
        query: () => ({
          url: `/locations`,
          method: 'GET',
        }),
      }),
      getOneLocation: builder.query<IceCreamLocation, string>({
        query: (locationId) => ({
          url: `/locations/${locationId}`,
          method: 'GET',
        }),
      }),
    };
  },
});

export const { useGetLocationsQuery, useGetOneLocationQuery } = locationsApi; // automatically generated query hook

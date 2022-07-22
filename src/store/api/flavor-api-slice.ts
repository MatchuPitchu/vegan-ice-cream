import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Flavor } from '../../types/types';

type NewFlavor = {
  name: string;
  color: {
    primary: string;
    secondary?: string;
  };
  type_cream: boolean;
  type_fruit: boolean;
};

// Define a service using a base URL and expected endpoints
export const flavorApi = createApi({
  reducerPath: 'flavorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/flavors`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('token', token);
      }
      return headers;
    },
  }),
  tagTypes: ['Flavor'], // define tag(s) which can trigger an action
  endpoints: (builder) => {
    return {
      getFlavors: builder.query<Flavor[], void>({
        query: () => ({
          url: '/',
          method: 'GET',
        }),
      }),
      addFlavor: builder.mutation<
        void,
        {
          comment_id: string;
          location_id: string;
          user_id: string;
          flavorData: NewFlavor;
        }
      >({
        query: ({ comment_id, location_id, user_id, flavorData }) => ({
          url: `/${comment_id}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            location_id,
            user_id,
            ...flavorData,
          },
          credentials: 'include',
        }),
      }),
    };
  },
});

export const { useGetFlavorsQuery, useAddFlavorMutation } = flavorApi;


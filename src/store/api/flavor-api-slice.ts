import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Flavor } from '../../types/types';

type NewFlavor = Pick<Flavor, 'name' | 'color' | 'type_cream' | 'type_fruit'>;

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

export const { useAddFlavorMutation } = flavorApi;

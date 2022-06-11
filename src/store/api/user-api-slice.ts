import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Comment, Flavor, IceCreamLocation } from '../../types/types';

interface ReturnTypeAdditionalInfosFromUser {
  comments_list: Comment[];
  favorite_locations: IceCreamLocation[];
  favorite_flavors: Flavor[];
}

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  // built-in fetch wrapper
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/users`,
    // include automatically token in headers of every Request defined here
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('token', token);
      }
      return headers;
    },
  }),
  tagTypes: ['User'], // define tag(s) which can trigger an action
  endpoints: (builder) => {
    return {
      getAdditionalInfosFromUser: builder.query<ReturnTypeAdditionalInfosFromUser, string>({
        query: (user_id) => ({
          url: `/${user_id}/infos`,
          method: 'GET',
          credentials: 'include',
        }),
      }),
      updateNumberOfNewLocations: builder.mutation<
        void,
        { user_id: string; numberOfLocations: number }
      >({
        query: ({ user_id, numberOfLocations }) => ({
          url: `/${user_id}/num-loc-last-visit`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: { current_num_loc: numberOfLocations },
        }),
      }),
    };
  },
});

export const { useGetAdditionalInfosFromUserQuery, useUpdateNumberOfNewLocationsMutation } =
  userApi; // automatically generated query hook
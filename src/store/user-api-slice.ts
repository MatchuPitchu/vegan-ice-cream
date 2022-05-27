import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Comment, Flavor, IceCreamLocation } from '../types';

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
    baseUrl: process.env.REACT_APP_API_URL,
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
        query: (userId) => ({
          url: `/users/${userId}/infos`,
          method: 'GET',
          credentials: 'include',
        }),
      }),
    };
  },
});

export const { useGetAdditionalInfosFromUserQuery } = userApi; // automatically generated query hook

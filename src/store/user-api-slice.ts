import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Comment, Flavour, Location, User } from '../types';

interface ReturnTypeAdditionalInfosFromUser {
  comments_list: Comment[];
  favorite_locations: Location[];
  favorite_flavors: Flavour[];
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
      getAdditionalInfosFromUser: builder.query<
        ReturnTypeAdditionalInfosFromUser,
        Pick<User, '_id'>
      >({
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

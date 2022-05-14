import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../types';

interface ReturnTypeVerifySession {
  success: string;
  user: User;
}

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
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
  tagTypes: ['Auth'], // define tag(s) which can trigger an action
  endpoints: (builder) => {
    return {
      verifySession: builder.query<ReturnTypeVerifySession, string>({
        query: () => ({
          url: '/auth/verify-session',
          method: 'GET',
          credentials: 'include',
        }),
      }),
    };
  },
});

export const { useVerifySessionQuery } = authApi; // automatically generated query hook

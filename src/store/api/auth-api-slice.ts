import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types';

interface ReturnTypeVerifySession {
  success: string;
  user: User;
}

interface ReturnTypeLoginRequest {
  user: User;
  token: string;
}

interface LoginData {
  email: string;
  password: string;
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
      // <ReturnType of Request, passed argument into query hook>
      verifyUserSession: builder.query<ReturnTypeVerifySession, void>({
        query: () => ({
          url: '/auth/verify-session',
          method: 'GET',
          credentials: 'include',
        }),
      }),
      loginUser: builder.mutation<ReturnTypeLoginRequest, LoginData>({
        query: ({ email, password }) => ({
          url: '/auth/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: { email, password },
          credentials: 'include',
        }),
      }),
    };
  },
});

export const { useVerifyUserSessionQuery, useLoginUserMutation } = authApi; // automatically generated query hook

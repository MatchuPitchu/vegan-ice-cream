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
    baseUrl: `${process.env.REACT_APP_API_URL}/auth`,
    // include automatically token in headers of every Request defined here
    // prepareHeaders is the last piece in the chain: has access to store, it could merge some header coming from the endpoint with a store value or similar things.
    // it's the most powerful & most dynamic api, so it is called last in the chain and can override everything.
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
          url: '/verify-session',
          method: 'GET',
          credentials: 'include',
        }),
      }),
      loginUser: builder.mutation<ReturnTypeLoginRequest, LoginData>({
        query: ({ email, password }) => ({
          url: '/login',
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

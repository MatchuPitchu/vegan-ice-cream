import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { authApi } from './api/auth-api-slice';
import { userApi } from './api/user-api-slice';

interface UserStateSlice {
  isAuth: boolean;
  user: User | null;
}

const initialAuthState: UserStateSlice = {
  isAuth: false,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialAuthState,
  reducers: {
    login: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.isAuth = false;
      state.user = null;
    },
    updateUser: (state, { payload }: PayloadAction<Partial<User>>) => {
      state.user = {
        ...state.user,
        ...payload,
      } as User;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.verifyUserSession.matchFulfilled, (state, { payload }) => {
      state.isAuth = true;
      state.user = {
        ...state.user,
        ...payload.user,
      } as User;
    });
    builder.addMatcher(authApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
      localStorage.setItem('token', payload.token);
      state.isAuth = payload.user.confirmed && true;
      state.user = {
        ...state.user,
        ...payload.user,
      } as User;
    });
    builder.addMatcher(
      userApi.endpoints.getAdditionalInfosFromUser.matchFulfilled,
      (state, { payload }) => {
        state.user = {
          ...state.user,
          ...payload,
        } as User;
      }
    );
  },
});

export const userActions = userSlice.actions;
export const userSliceReducer = userSlice.reducer;

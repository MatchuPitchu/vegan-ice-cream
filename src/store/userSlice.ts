import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/types';
import { authApi } from './api/auth-api-slice';
import { userApi } from './api/user-api-slice';
import type { Comment } from '../types/types';

interface UserStateSlice {
  isAuth: boolean;
  user: User | null;
  numberOfNewLocations: number | null;
}

const initialAuthState: UserStateSlice = {
  isAuth: false,
  user: null,
  numberOfNewLocations: null,
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
    deleteCommentFromUser: (state, { payload: commentId }: PayloadAction<string>) => {
      if (state.user) {
        const commentsList = [...state.user.comments_list] as Comment[];
        const newUserCommentsList = commentsList.filter((item) => item._id !== commentId);
        state.user.comments_list = newUserCommentsList;
      }
    },
    setNumberOfNewLocations: (state, { payload }: PayloadAction<number>) => {
      state.numberOfNewLocations = payload;
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

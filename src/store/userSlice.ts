import type { Flavor, User } from '../types/types';
import type { Comment } from '../types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from './api/auth-api-slice';
import { commentApi } from './api/comment-api-slice';
import { userApi } from './api/user-api-slice';

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
    addFlavorToUserFavoriteFlavors: (state, { payload }: PayloadAction<Flavor>) => {
      state.user!.favorite_flavors = [...state.user!.favorite_flavors, payload];
    },
    deleteCommentFromUser: (state, { payload: commentId }: PayloadAction<string>) => {
      if (state.user) {
        const commentsList = [...state.user.comments_list];
        const newUserCommentsList = commentsList.filter((item) => item._id !== commentId);
        state.user.comments_list = newUserCommentsList;
      }
    },
    updateCommentsListFromUser: (state, { payload: updatedComment }: PayloadAction<Comment>) => {
      if (!state.user) return;
      const newCommentsList = [...state.user.comments_list];
      const updatedCommentIndex = newCommentsList.findIndex(
        (comment) => comment._id === updatedComment._id
      );

      if (!updatedCommentIndex) return;
      newCommentsList.splice(updatedCommentIndex, 1, updatedComment);

      state.user.comments_list = newCommentsList;
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
      commentApi.endpoints.addComment.matchFulfilled,
      (state, { payload: newComment }) => {
        state.user!.comments_list = [...state.user!.comments_list, newComment];
      }
    );
  },
});

export const userActions = userSlice.actions;
export const userSliceReducer = userSlice.reducer;

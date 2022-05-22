import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

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
});

export const userActions = userSlice.actions;
export const userSliceReducer = userSlice.reducer;

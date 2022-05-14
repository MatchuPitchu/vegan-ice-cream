import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthStateSlice {
  isAuth: boolean;
  user: User | null;
}

const initialAuthState: AuthStateSlice = {
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
  },
});

export const userActions = userSlice.actions;
export const userSliceReducer = userSlice.reducer;

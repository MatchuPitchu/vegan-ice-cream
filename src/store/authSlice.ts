import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthStateSlice {
  isAuth: boolean;
  user: User;
}

const initialAuthState: AuthStateSlice = {
  isAuth: false,
  user: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    test: (state, action: PayloadAction<AuthStateSlice>) => {
      return action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export const authSliceReducer = authSlice.reducer;

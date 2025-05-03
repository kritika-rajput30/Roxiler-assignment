// src/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: 'ADMIN' | 'USER' | 'OWNER' | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string, role: string }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role as AuthState['role'];
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});


export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

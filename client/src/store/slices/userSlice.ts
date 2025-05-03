// src/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
}

interface UserState {
  currentUser?: User;  // Currently logged-in user
}

const initialState: UserState = {
  currentUser: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = undefined;
    },
  },
});

export const { setCurrentUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;

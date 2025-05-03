import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import storeReducer from './slices/storeSlice';
import ratingReducer from './slices/ratingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    stores: storeReducer,
    ratings: ratingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

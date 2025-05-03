// src/slices/ratingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Rating {
  id: string;
  comment: string;
  rating: number;
  store_id: string;
  user_id: string;
}

interface RatingState {
  ratings: Rating[];
}

const initialState: RatingState = {
  ratings: [],
};

const ratingSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    setRatings: (state, action: PayloadAction<Rating[]>) => {
      state.ratings = action.payload;
    },
  },
});

export const { setRatings } = ratingSlice.actions;
export default ratingSlice.reducer;
